import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
@ApiTags('Health')
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  root() {
    return {
      message: 'Scholarship Backend API',
      version: '1.0.0',
      docs: '/api/docs',
      health: '/health',
    };
  }
}
