# Lumina CRM - Ad Agency Customer Relationship Management System

A modern, full-featured CRM application built for advertising agencies to manage their client pipeline and track business performance. Built with React, TypeScript, Tailwind CSS, and Zustand for state management.

![Lumina CRM](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-blue)

## ✨ Features

### 📊 Analytics Dashboard
- **Real-time Metrics**: Track total pipeline value, active leads, conversion rate, and average deal size
- **Interactive Charts**: Visual representation of revenue trends and pipeline distribution by status
- **High-Value Leads**: Quick access to your most valuable opportunities
- **Attention Alerts**: Automated notifications for leads requiring follow-up
- **Recent Activity**: Timeline of recent deal closures and updates

### 👥 Lead Management
- **Complete CRUD Operations**: Add, edit, delete, and view customer leads
- **Advanced Filtering**: Search by name, company, or email with real-time filtering
- **Status Tracking**: Track leads through their lifecycle (New → Contacted → Qualified → Proposal → Negotiation → Won/Lost)
- **Lead Scoring**: Visual scoring system (0-100%) to prioritize opportunities
- **Deal Value Tracking**: Monitor potential revenue for each opportunity
- **Contact Information**: Store comprehensive customer details including industry, notes, and contact dates

### 💾 Data Persistence
- **LocalStorage Integration**: All data persists across browser sessions using Zustand's persist middleware
- **Sample Data**: Pre-loaded with realistic sample leads for immediate testing
- **State Management**: Centralized state using Zustand for optimal performance

### 🎨 Modern UI/UX
- **Dark Theme**: Eye-friendly dark mode interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion-powered transitions and interactions
- **Glass Morphism**: Modern glass-panel design aesthetic
- **Interactive Components**: Hover effects, dropdowns, and modals for enhanced UX

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
lumina-crm/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main app layout with sidebar navigation
│   ├── pages/
│   │   ├── Dashboard.tsx       # Analytics dashboard with charts
│   │   └── Leads.tsx          # Lead management with CRUD operations
│   ├── store/
│   │   └── useStore.ts        # Zustand store with state management
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles and Tailwind imports
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

## 🛠️ Tech Stack

- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.10
- **Styling**: Tailwind CSS 3.4.14
- **State Management**: Zustand 5.0.1 with persist middleware
- **Charts**: Recharts 2.13.3
- **Icons**: Lucide React 0.454.0
- **Animations**: Framer Motion 11.11.11
- **Utilities**: clsx, tailwind-merge

## 💡 Usage Guide

### Dashboard
The dashboard provides an at-a-glance view of your business:
- View key metrics cards showing pipeline value, active leads, conversion rate, and average deal size
- Analyze trends with the revenue forecast chart
- See your top 3 high-value opportunities
- Review leads requiring attention
- Track recent successful deals

### Lead Management
Navigate to the "Leads" section from the sidebar to:
- **Add New Leads**: Click "Add New Lead" button and fill in the form
- **Search & Filter**: Use the search bar and status filter to find specific leads
- **Edit Leads**: Click the three-dot menu on any lead row and select "Edit"
- **Delete Leads**: Click the three-dot menu and select "Delete" (with confirmation)
- **View Details**: See comprehensive information for each lead in the table

### Lead Statuses
- **New**: Freshly acquired lead
- **Contacted**: Initial contact made
- **Qualified**: Lead meets criteria and budget
- **Proposal**: Proposal/quote sent
- **Negotiation**: In active negotiations
- **Won**: Deal successfully closed
- **Lost**: Opportunity lost to competitor or budget

## 🎯 Key Features Implemented

✅ Full CRUD operations for customer/lead management  
✅ Real-time analytics with computed metrics  
✅ Interactive charts and data visualization  
✅ Search and filter functionality  
✅ LocalStorage persistence  
✅ Responsive design  
✅ Modal forms for add/edit operations  
✅ Delete confirmation dialogs  
✅ State management with Zustand  
✅ Clean, modern UI with Tailwind CSS  
✅ TypeScript for type safety  
✅ Sample data for testing  

## 📊 Analytics Calculations

- **Total Pipeline**: Sum of all active leads (excludes won/lost)
- **Active Leads**: Count of leads not in won/lost status
- **Conversion Rate**: (Won deals / Total closed deals) × 100
- **Average Deal Size**: Total pipeline value / Active leads count
- **Revenue by Status**: Aggregated value grouped by lead status
- **Revenue Over Time**: 7-day trend of pipeline value

## 🎨 Design Highlights

- **Color Palette**: Purple primary (#9E7FFF), with cyan, pink accents
- **Dark Theme**: Background (#171717), Surface (#262626)
- **Typography**: Inter font family for clean, modern text
- **Border Radius**: Generous rounded corners (xl, 2xl)
- **Glass Panels**: Semi-transparent backgrounds with backdrop blur
- **Animations**: Smooth transitions and micro-interactions

## 🔮 Future Enhancements

Potential features for future development:
- Pipeline visualization with drag-and-drop
- Email integration for lead communication
- Task management and reminders
- Advanced reporting and exports
- Team collaboration features
- Integration with external CRM systems
- File attachments for leads
- Activity timeline for each lead
- Custom fields and tags
- Advanced search with multiple filters

## 📝 License

This project was created as part of the Byteable AI Engineering Challenge.

## 🙋 Support

For questions or issues:
1. Check the code comments for implementation details
2. Review the TypeScript types in `useStore.ts` for data structures
3. Examine component props and state management

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand Guide](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Recharts Examples](https://recharts.org/en-US/examples)

---

**Built with ❤️ using Byteable AI tools**
