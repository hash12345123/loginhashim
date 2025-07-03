# Components Folder

This folder contains reusable React components for the dashboard application.

## 📁 Component Structure

```
src/components/
├── DashboardCard.js      # Dashboard navigation cards
├── StatCard.js          # Statistics display cards
├── ActivityItem.js      # Activity feed items
├── SidebarItem.js       # Sidebar navigation items
├── UserProfile.js       # User profile section
├── Navbar.js           # Top navigation bar
├── Sidebar.js          # Sidebar container
├── index.js            # Component exports
└── README.md           # This documentation
```

## 🎯 Component Details

### DashboardCard
- **Purpose**: Displays dashboard navigation cards
- **Props**: 
  - `card`: Object with `id`, `title`, `description`, `color`
  - `onClick`: Function to handle card clicks

### StatCard
- **Purpose**: Displays statistics with values and changes
- **Props**:
  - `title`: Card title
  - `value`: Statistic value
  - `change`: Change text (e.g., "+12% this month")
  - `changeType`: "positive", "negative", or "neutral"

### ActivityItem
- **Purpose**: Displays activity feed items
- **Props**:
  - `icon`: Activity icon emoji
  - `title`: Activity title
  - `description`: Activity description
  - `time`: Time ago text

### SidebarItem
- **Purpose**: Individual sidebar navigation items
- **Props**:
  - `item`: Object with `id`, `label`, `icon`
  - `isActive`: Boolean for active state
  - `onClick`: Function to handle clicks

### UserProfile
- **Purpose**: User profile section in sidebar
- **Props**:
  - `userName`: User's display name
  - `userEmail`: User's email address

### Navbar
- **Purpose**: Top navigation bar
- **Props**:
  - `onToggleSidebar`: Function to toggle sidebar
  - `userName`: User's display name
  - `onLogout`: Function to handle logout

### Sidebar
- **Purpose**: Complete sidebar container
- **Props**:
  - `isCollapsed`: Boolean for collapsed state
  - `isMobile`: Boolean for mobile state
  - `userName`: User's display name
  - `userEmail`: User's email address
  - `sidebarItems`: Array of sidebar items
  - `activeTab`: Currently active tab
  - `onItemClick`: Function to handle item clicks

## 🚀 Usage Examples

### Using DashboardCard
```jsx
import { DashboardCard } from './components';

const card = {
  id: "profile",
  title: "👤 Profile",
  description: "View and update your personal information",
  color: "#4CAF50"
};

<DashboardCard 
  card={card}
  onClick={(id) => handleNavigation(id)}
/>
```

### Using StatCard
```jsx
import { StatCard } from './components';

<StatCard 
  title="📊 Total Orders"
  value="24"
  change="+12% this month"
  changeType="positive"
/>
```

### Using ActivityItem
```jsx
import { ActivityItem } from './components';

<ActivityItem 
  icon="🛒"
  title="Order #12345 placed"
  description="You placed an order for $89.99"
  time="2 hours ago"
/>
```

## 🎨 Styling

All components use the existing CSS classes from `Home.css`. The components are designed to be:
- **Responsive**: Work on all screen sizes
- **Accessible**: Include proper ARIA labels and semantic HTML
- **Reusable**: Can be used in different contexts
- **Consistent**: Follow the same design patterns

## 🔧 Best Practices

1. **Props Validation**: Consider adding PropTypes for better development experience
2. **Error Boundaries**: Wrap components in error boundaries for production
3. **Testing**: Each component should have unit tests
4. **Documentation**: Keep this README updated as components change
5. **Performance**: Use React.memo for components that don't need frequent re-renders

## 📝 Future Enhancements

- Add TypeScript for better type safety
- Create storybook stories for component documentation
- Add unit tests for each component
- Implement theme support for different color schemes
- Add loading states and error handling 