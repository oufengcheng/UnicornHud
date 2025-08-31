import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, Search, TrendingUp } from 'lucide-react';

/**
 * Empty State Component
 * Provides user guidance when pages have no content
 */
const EmptyState = ({ 
  type = 'default',
  title,
  description,
  actionText,
  onAction,
  icon: CustomIcon,
  showSecondaryAction = false,
  secondaryActionText,
  onSecondaryAction
}) => {
  // Default configurations for different empty state types
  const configs = {
    portfolio: {
      icon: TrendingUp,
      title: 'Start Your Investment Journey',
      description: 'You haven\'t made any investments yet. Explore our curated projects and start building your portfolio.',
      actionText: 'Explore Projects',
      secondaryActionText: 'Learn About Investing'
    },
    projects: {
      icon: Search,
      title: 'No Projects Found',
      description: 'We couldn\'t find any projects matching your criteria. Try adjusting your filters or explore all projects.',
      actionText: 'View All Projects',
      secondaryActionText: 'Reset Filters'
    },
    community: {
      icon: Plus,
      title: 'Join the Conversation',
      description: 'Be the first to share your thoughts and connect with other members of the Unicorn 100 community.',
      actionText: 'Create First Post',
      secondaryActionText: 'Explore Community'
    },
    activity: {
      icon: TrendingUp,
      title: 'No Recent Activity',
      description: 'Your activity feed is empty. Start exploring projects, making investments, or connecting with other users.',
      actionText: 'Explore Platform',
      secondaryActionText: 'View Trending Projects'
    },
    default: {
      icon: Search,
      title: 'Nothing Here Yet',
      description: 'This section is currently empty. Check back later or explore other parts of the platform.',
      actionText: 'Go Back',
      secondaryActionText: 'Explore Platform'
    }
  };

  const config = configs[type] || configs.default;
  const Icon = CustomIcon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || config.actionText;
  const finalSecondaryActionText = secondaryActionText || config.secondaryActionText;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-purple-600" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {finalTitle}
      </h3>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {finalDescription}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Primary Action */}
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
        >
          {finalActionText}
          <ArrowRight size={16} className="ml-2" />
        </Button>

        {/* Secondary Action */}
        {(showSecondaryAction || onSecondaryAction) && (
          <Button
            variant="outline"
            onClick={onSecondaryAction}
            className="px-6 py-3"
          >
            {finalSecondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Portfolio Empty State
 * Specific empty state for portfolio page
 */
export const PortfolioEmptyState = ({ onExploreProjects, onLearnMore }) => (
  <EmptyState
    type="portfolio"
    onAction={onExploreProjects}
    onSecondaryAction={onLearnMore}
    showSecondaryAction={true}
  />
);

/**
 * Community Empty State
 * Specific empty state for community features
 */
export const CommunityEmptyState = ({ onCreatePost, onExploreCommunity }) => (
  <EmptyState
    type="community"
    onAction={onCreatePost}
    onSecondaryAction={onExploreCommunity}
    showSecondaryAction={true}
  />
);

/**
 * Activity Empty State
 * Specific empty state for activity feeds
 */
export const ActivityEmptyState = ({ onExplore, onViewTrending }) => (
  <EmptyState
    type="activity"
    onAction={onExplore}
    onSecondaryAction={onViewTrending}
    showSecondaryAction={true}
  />
);

/**
 * Search Empty State
 * Specific empty state for search results
 */
export const SearchEmptyState = ({ onViewAll, onResetFilters, searchTerm }) => (
  <EmptyState
    type="projects"
    title="No Results Found"
    description={searchTerm 
      ? `We couldn't find any projects matching "${searchTerm}". Try different keywords or browse all projects.`
      : "No projects match your current filters. Try adjusting your criteria or view all projects."
    }
    onAction={onViewAll}
    onSecondaryAction={onResetFilters}
    showSecondaryAction={true}
  />
);

/**
 * Loading Empty State
 * Shows while content is loading
 */
export const LoadingEmptyState = ({ message = "Loading content..." }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {/* Loading Spinner */}
    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
    
    {/* Loading Message */}
    <p className="text-gray-600 text-lg">
      {message}
    </p>
  </div>
);

/**
 * Error Empty State
 * Shows when there's an error loading content
 */
export const ErrorEmptyState = ({ 
  title = "Something went wrong",
  description = "We encountered an error while loading this content. Please try again.",
  onRetry,
  onGoBack
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {/* Error Icon */}
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <span className="text-3xl">⚠️</span>
    </div>

    {/* Title */}
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      {title}
    </h3>

    {/* Description */}
    <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
      {description}
    </p>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-3">
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
        >
          Try Again
        </Button>
      )}
      
      {onGoBack && (
        <Button
          variant="outline"
          onClick={onGoBack}
          className="px-6 py-3"
        >
          Go Back
        </Button>
      )}
    </div>
  </div>
);

export default EmptyState;

