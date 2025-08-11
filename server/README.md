# Social Media Automation Backend

A comprehensive Node.js backend for social media automation using Puppeteer and Playwright for headless browser automation.

## Features

- **Multi-Platform Support**: Instagram, Facebook, Twitter/X, LinkedIn, TikTok
- **Browser Automation**: Puppeteer and Playwright support
- **Job Queue System**: Redis-based job processing with Bull
- **Post Scheduling**: Cron-based scheduler for automated posting
- **User Authentication**: JWT-based authentication
- **Analytics Tracking**: Post performance metrics
- **Rate Limiting**: API protection and abuse prevention
- **Comprehensive Logging**: Winston-based logging system

## Prerequisites

- Node.js 18+ 
- MongoDB
- Redis
- Chrome/Chromium (for Puppeteer)

## Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Create required directories:
```bash
mkdir -p logs uploads
```

## Environment Configuration

Key environment variables in `.env`:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/social-media-automation
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-here
BROWSER_HEADLESS=true
```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get user posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/:id/analytics` - Get post analytics

### Automation
- `GET /api/automation/settings` - Get automation settings
- `PUT /api/automation/settings` - Update automation settings
- `GET /api/automation/queue/stats` - Get job queue statistics
- `GET /api/automation/platforms` - Get supported platforms

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics/timeline` - Get analytics timeline
- `GET /api/dashboard/analytics/platforms` - Get platform performance

## Architecture

### Browser Automation
The system supports both Puppeteer and Playwright for browser automation:

- **Puppeteer**: Chrome/Chromium-based automation
- **Playwright**: Multi-browser support (Chrome, Firefox, Safari)

### Job Queue System
Uses Bull with Redis for reliable job processing:

- Automatic retries with exponential backoff
- Job scheduling and delayed execution
- Comprehensive error handling and logging

### Database Schema
MongoDB with Mongoose ODM:

- **Users**: Authentication and profile data
- **Posts**: Post content, scheduling, and analytics
- **AutomationSettings**: User-specific automation configuration

### Security Features
- JWT authentication with secure token handling
- Rate limiting on all API endpoints
- Input validation and sanitization
- Helmet.js for security headers
- CORS configuration for cross-origin requests

## Browser Automation Flow

1. **Job Creation**: Posts are added to the job queue
2. **Browser Launch**: Puppeteer/Playwright launches browser instance
3. **Platform Navigation**: Automated navigation to social media platforms
4. **Content Upload**: Media and caption posting
5. **Analytics Collection**: Performance metrics extraction
6. **Result Processing**: Success/failure handling and database updates

## Monitoring and Logging

- **Winston Logging**: Structured logging with multiple transports
- **Health Checks**: `/health` endpoint for monitoring
- **Queue Statistics**: Real-time job queue monitoring
- **Error Tracking**: Comprehensive error logging and handling

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database and Redis instances
3. Set up proper SSL certificates
4. Configure reverse proxy (nginx recommended)
5. Set up process management (PM2 recommended)
6. Configure log rotation
7. Set up monitoring and alerting

## Scaling Considerations

- **Horizontal Scaling**: Multiple server instances with shared Redis/MongoDB
- **Browser Pool Management**: Reuse browser instances for better performance
- **Queue Workers**: Separate worker processes for job processing
- **Database Indexing**: Optimized queries with proper indexing
- **Caching**: Redis caching for frequently accessed data

## Security Best Practices

- Regular dependency updates
- Secure credential storage (never in code)
- OAuth integration for social media platforms
- Rate limiting and DDoS protection
- Regular security audits
- Encrypted data transmission (HTTPS)

## Contributing

1. Follow TypeScript best practices
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation
5. Follow the existing code style

## License

MIT License - see LICENSE file for details