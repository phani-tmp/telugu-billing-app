# Telugu Voice-Enabled Billing Application

## Overview
A mobile-first voice-enabled billing application for shops in Telugu language using Chrome Web Speech API. Shopkeepers can manage inventory (vegetables/raw materials) by voice, add items with fluctuating prices, create bills by speaking quantities in kg, and track daily business totals. All data persists in a PostgreSQL database with automatic bill history.

## Current State
- Fully functional prototype with Telugu voice recognition, inventory management, and bill generation
- PostgreSQL database integration with Drizzle ORM for persistent storage
- Price editing feature for daily price updates
- Daily business totals view in history
- Minimum quantity increments: 0.25kg
- All critical bugs fixed

## Recent Changes (October 7, 2025)
- Implemented PostgreSQL database with items, bills, and billItems tables
- Added price editing functionality with validation
- Implemented daily business totals calculation
- Changed minimum quantity from 0.5kg to 0.25kg
- Fixed query invalidation for daily totals after bill creation
- Added PATCH request validation for item price updates

## Project Architecture

### Database Schema (shared/schema.ts)
- **Items Table**: id, name, price (editable daily for price fluctuations)
- **Bills Table**: id, billNumber, totalAmount, createdAt
- **BillItems Table**: id, billId, itemId, itemName, quantity, price, total

### Backend (server/)
- **storage.ts**: IStorage interface with MemStorage and DBStorage implementations
- **routes.ts**: RESTful API routes for items and bills with Zod validation
- **db.ts**: Drizzle ORM database connection

### Frontend (client/src/)
- **pages/Inventory.tsx**: Manage items with voice input and price editing
- **pages/NewBill.tsx**: Create bills with voice-enabled quantity input
- **pages/History.tsx**: View bill history with date filtering and daily totals
- **hooks/useSpeechRecognition.ts**: Chrome Web Speech API wrapper for Telugu (te-IN)
- **components/**: Reusable UI components (VoiceButton, QuantityInput, BillDisplay, etc.)

## User Preferences
- Telugu language only (te-IN)
- Free Google Chrome Web Speech API
- Minimum quantity: 0.25kg increments
- Daily editable prices for vegetables
- Mobile-first design with large touch targets (48-56px)
- Noto Sans Telugu font for proper Telugu rendering

## Technical Notes
- TanStack Query configured with staleTime: Infinity - requires manual query invalidation
- useSpeechRecognition uses useCallback to prevent infinite re-renders
- Daily totals invalidation: `/api/daily-total` queries invalidated after bill creation
- Database migrations managed via Drizzle with `npm run db:push`

## Important Files
- shared/schema.ts - Database schema and Zod validation
- server/routes.ts - API routes
- server/storage.ts - Storage interface
- client/src/hooks/useSpeechRecognition.ts - Voice recognition hook
- client/src/pages/Inventory.tsx - Inventory management
- client/src/pages/NewBill.tsx - Bill creation
- client/src/pages/History.tsx - Bill history and daily totals
- design_guidelines.md - UI/UX design guidelines

## Running the Project
- Workflow "Start application" runs `npm run dev`
- Frontend and backend served on same port (5000)
- Database connection via DATABASE_URL environment variable
