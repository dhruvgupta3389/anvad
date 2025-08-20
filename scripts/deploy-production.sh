#!/bin/bash

# Production Deployment Script for ANVEDA
# This script ensures all optimizations are applied before deployment

set -e

echo "🚀 Starting production deployment process..."

# 1. Environment check
echo "📋 Checking environment variables..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Please ensure all environment variables are set."
    echo "📄 Reference .env.example for required variables."
fi

# 2. Clean install dependencies
echo "🧹 Cleaning node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm ci --omit=dev --no-audit

# 3. Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate

# 4. Lint check
echo "🔍 Running ESLint..."
npm run lint

# 5. Type checking
echo "📝 Running TypeScript type check..."
npx tsc --noEmit

# 6. Build application
echo "🏗️  Building application for production..."
npm run build

# 7. Bundle analysis (optional)
if [ "$ANALYZE_BUNDLE" = "true" ]; then
    echo "📊 Analyzing bundle size..."
    npm run build:analyze
fi

# 8. Test production build
echo "🧪 Testing production build..."
timeout 30s npm start &
SERVER_PID=$!
sleep 10

# Simple health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Production server is running correctly"
else
    echo "❌ Production server failed health check"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo "✅ Production deployment preparation complete!"
echo "🚀 Ready to deploy to Vercel!"

# Display deployment info
echo ""
echo "📋 Deployment Summary:"
echo "   • Dependencies installed and audited"
echo "   • Code linted and type-checked"
echo "   • Production build successful"
echo "   • Server health check passed"
echo ""
echo "💡 Next steps:"
echo "   1. Push changes to your repository"
echo "   2. Deploy via Vercel dashboard or CLI"
echo "   3. Verify environment variables in Vercel"
echo "   4. Test the live deployment"
