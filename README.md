# ILOS Mobile App

**Intelligent Loan Origination System** - Mobile application for EAMVU Officers

## Overview

ILOS Mobile is a React Native application designed for EAMVU (External Agent Mobile Verification Unit) Officers to manage and process loan applications assigned to them. The app provides a streamlined interface for viewing application details, managing document collection, and updating application statuses.

## Features

### 🏠 **Splash Screen**
- UBL branding with blue background (#3B82F6)
- App name and description display
- 3-second auto-navigation to login

### 🔐 **Login Screen**
- Username and password authentication
- Clean, professional design matching web app
- Role-based login (EAMVU Officer)

### 📱 **Home Screen**
- List of assigned applications
- Application status indicators
- Priority badges (High, Medium, Low)
- Pull-to-refresh functionality
- Quick access to application details

### 📋 **Application Detail Screen**
- Complete application information
- Applicant details and contact information
- Loan type and amount details
- Required documents list
- Document status management
- Notes and special instructions

## Screenshots

The app follows the design patterns from the web application:
- [Web App Login](https://ilos-frontend.vercel.app/login)
- [EAMVU Dashboard](https://ilos-frontend.vercel.app/dashboard/eamvu/new)

## Technical Stack

- **React Native** 0.80.2
- **TypeScript** for type safety
- **React Navigation** for routing
- **Custom Components** for consistent UI

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
├── screens/            # Main app screens
├── types/              # TypeScript interfaces
├── utils/              # Mock data and utilities
└── assets/             # Images and static files
```

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio / Xcode

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For Android:
   ```bash
   npm run android
   ```

4. For iOS:
   ```bash
   npm run ios
   ```

### Login Credentials

For testing purposes:
- **Username:** `eamvu`
- **Password:** `password`

## Mock Data

The app includes realistic mock data with:
- 3 sample applications
- Different loan types (Personal, Auto, Business)
- Various document requirements
- Realistic Pakistani addresses and phone numbers

## Design Principles

### User Experience
- **Minimalistic Design**: Clean, uncluttered interface
- **Age-Appropriate**: Optimized for users aged 30-40
- **Professional**: Banking-grade UI/UX
- **Accessible**: Large touch targets and clear typography

### Color Scheme
- **Primary Blue**: #3B82F6 (UBL brand color)
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444
- **Neutral Grays**: Various shades for text and backgrounds

## Features for EAMVU Officers

### Application Management
- View assigned applications
- Check application status
- Access applicant contact information
- Review loan details and amounts

### Document Collection
- View required documents
- Update document collection status
- Mark documents as verified
- Track collection progress

### Field Work Support
- Access visit addresses
- View special instructions
- Update application progress
- Manage multiple applications

## Future Enhancements

- Real-time notifications
- Offline capability
- Document photo capture
- GPS location tracking
- Integration with web backend
- Push notifications for new assignments

## Contributing

This is a UBL internal application. For questions or issues, please contact the development team.

## License

Internal use only - UBL Bank
