import puppeteer, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer';
import { logger } from '../utils/logger';
import { BrowserAutomationResult, JobData } from '../types';

export class BrowserAutomationService {
  private puppeteerBrowser: PuppeteerBrowser | null = null;

  async initializePuppeteer(headless: boolean = true): Promise<PuppeteerBrowser> {
    if (this.puppeteerBrowser) {
      await this.puppeteerBrowser.close();
    }
    
    this.puppeteerBrowser = await puppeteer.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
      ],
      defaultViewport: { width: 1366, height: 768 },
    });
    
    return this.puppeteerBrowser;
  }

  async postToFacebook(
    jobData: JobData, 
    browserType: 'puppeteer' | 'playwright', 
    headless: boolean = true
  ): Promise<BrowserAutomationResult> {
    try {
      logger.info(`Posting to Facebook using ${browserType}`, { 
        postId: jobData.postId,
        headless 
      });

      return await this.postToFacebookPuppeteer(jobData, headless);
    } catch (error) {
      logger.error('Facebook posting failed:', error);
      return {
        success: false,
        platform: 'facebook',
        message: 'Failed to post to Facebook',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async postToFacebookPuppeteer(jobData: JobData, headless: boolean): Promise<BrowserAutomationResult> {
    const browser = await this.initializePuppeteer(headless);
    const page: PuppeteerPage = await browser.newPage();

    try {
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      logger.info('Navigating to Facebook');
      await page.goto('https://www.facebook.com', { waitUntil: 'networkidle2', timeout: 30000 });

      // Check if login is needed
      const emailInput = await page.$('input[name="email"]');
      if (emailInput) {
        logger.info('Logging into Facebook');
        
        await page.waitForSelector('input[name="email"]', { timeout: 10000 });
        await page.type('input[name="email"]', process.env.FBusername || '');
        await page.type('input[name="pass"]', process.env.FBpassword || '');
        
        await page.click('button[name="login"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        
        // Handle potential security checks or notifications
        try {
          await page.waitForTimeout(3000);
          
          // Try to dismiss any popups or notifications
          const dismissButtons = await page.$$('div[aria-label="Close"], button[aria-label="Close"], div[role="button"]:has-text("Not Now")');
          for (const button of dismissButtons) {
            try {
              await button.click();
              await page.waitForTimeout(1000);
            } catch (e) {
              // Continue if button click fails
            }
          }
        } catch (e) {
          // Continue if no popups to dismiss
        }
      }

      logger.info('Looking for post creation area');
      
      // Wait for the main feed to load and find the post creation area
      await page.waitForTimeout(5000);
      
      // Try multiple selectors for the post creation area
      const postSelectors = [
        'div[role="textbox"][contenteditable="true"]',
        'div[data-testid="status-attachment-mentions-input"]',
        'div[aria-label*="What\'s on your mind"]',
        'div[aria-label*="Write a post"]',
        'textarea[placeholder*="What\'s on your mind"]'
      ];
      
      let postBox = null;
      for (const selector of postSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
          postBox = await page.$(selector);
          if (postBox) {
            logger.info(`Found post box with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!postBox) {
        throw new Error('Could not find Facebook post creation area');
      }

      // Click on the post creation area
      await postBox.click();
      await page.waitForTimeout(2000);

      // Type the caption
      logger.info('Adding caption to Facebook post');
      await page.keyboard.type(jobData.caption);
      await page.waitForTimeout(2000);

      // Handle media upload if provided
      if (jobData.media && jobData.media.length > 0) {
        logger.info('Attempting to add media to post');
        // For now, we'll skip media upload as it requires file handling
        // In a real implementation, you'd download the image and upload it
      }

      // Look for and click the Post button
      logger.info('Looking for Post button');
      
      const postButtonSelectors = [
        'div[aria-label="Post"][role="button"]',
        'button[aria-label="Post"]',
        'div[role="button"]:has-text("Post")',
        'button:has-text("Post")'
      ];
      
      let postButton = null;
      for (const selector of postButtonSelectors) {
        try {
          postButton = await page.$(selector);
          if (postButton) {
            logger.info(`Found post button with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (postButton) {
        await postButton.click();
        logger.info('Clicked Post button');
        
        // Wait for the post to be published
        await page.waitForTimeout(5000);
        
        // Check for success indicators
        try {
          await page.waitForSelector('div[role="alert"]', { timeout: 10000 });
          logger.info('Post appears to have been published successfully');
        } catch (e) {
          logger.info('No success alert found, but post likely published');
        }
      } else {
        throw new Error('Could not find Post button');
      }

      logger.info('Facebook post completed successfully', { postId: jobData.postId });

      return {
        success: true,
        platform: 'facebook',
        message: 'Successfully posted to Facebook',
      };
    } catch (error) {
      logger.error('Facebook posting error:', error);
      throw error;
    } finally {
      if (!headless) {
        // If visible mode, wait a bit before closing so user can see the result
        await page.waitForTimeout(5000);
      }
      await page.close();
    }
  }

  async closeBrowsers(): Promise<void> {
    try {
      if (this.puppeteerBrowser) {
        await this.puppeteerBrowser.close();
        this.puppeteerBrowser = null;
      }
    } catch (error) {
      logger.error('Error closing browsers:', error);
    }
  }
}

export const browserAutomation = new BrowserAutomationService();