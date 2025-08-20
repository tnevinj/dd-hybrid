'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, Users, GraduationCap, TrendingUp, Search, Filter, Plus, 
  Star, Eye, MessageSquare, Download, Share2, Clock, Target, Brain,
  Lightbulb, Award, Bookmark, ThumbsUp, Activity, BarChart3, PieChart,
  FileText, User, Calendar, Tag, Zap, Globe, CheckCircle, ArrowRight
} from 'lucide-react';

import {
  NavigationMode,
  KnowledgeManagementResponse,
  KnowledgeArticle,
  PopularArticle,
  ExpertSummary,
  LearningPath,
  KnowledgePattern,
  RecentActivity,
  CategoryMetrics,
  SearchTrend,
  KnowledgeStats,
  HybridModeContent,
  ArticleCategory,
  ArticleType,
  Difficulty,
  Importance
} from '@/types/knowledge-management';

interface KnowledgeManagementDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export function KnowledgeManagementDashboard({ navigationMode, onModeChange }: KnowledgeManagementDashboardProps) {
  const [data, setData] = useState<KnowledgeManagementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const hybridContent: HybridModeContent = {
    traditional: {
      showAllArticles: true,
      enableManualCuration: true,
      showDetailedMetrics: true,
      advancedSearch: true,
    },
    assisted: {
      showRecommendations: true,
      highlightTrending: true,
      smartSearch: true,
      autoTagging: true,
      relatedContent: true,
    },
    autonomous: {
      autoRecommendations: true,
      patternDetection: true,
      contentCuration: true,
      intelligentRouting: true,
      adaptiveLearning: true,
      predictiveAnalytics: true,
    },
  };

  useEffect(() => {
    fetchKnowledgeData();
  }, [navigationMode]);

  const fetchKnowledgeData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/knowledge-management');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching knowledge management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800';
      case 'ADVANCED': return 'bg-orange-100 text-orange-800';
      case 'EXPERT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceColor = (importance: Importance): string => {
    switch (importance) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load knowledge management data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderModeSelector = () => (
    <div className="flex items-center gap-2 mb-6">
      <label className="text-sm font-medium">Navigation Mode:</label>
      <Select value={navigationMode} onValueChange={onModeChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="traditional">Traditional</SelectItem>
          <SelectItem value="assisted">Assisted</SelectItem>
          <SelectItem value="autonomous">Autonomous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Knowledge Articles</p>
              <p className="text-2xl font-bold">{data.stats.publishedArticles}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subject Experts</p>
              <p className="text-2xl font-bold">{data.stats.expertProfiles}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Learning Paths</p>
              <p className="text-2xl font-bold">{data.stats.learningPaths}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{formatNumber(data.stats.totalViews)}</p>
            </div>
            <Eye className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPopularArticles = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular Articles
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Trending</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.popularArticles.slice(0, 5).map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold line-clamp-1">{article.title}</h4>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline">{article.category.replace('_', ' ')}</Badge>
                  <Badge 
                    variant={article.trend === 'RISING' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {article.trend}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(article.viewCount)} views</span>
                  </div>
                  {renderStars(article.averageRating)}
                  {article.readingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readingTime} min read</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryMetrics = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Knowledge Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.categoryMetrics.map((category) => (
            <div key={category.category} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{category.category.replace('_', ' ')}</h4>
                {category.trending && (
                  <Badge variant="default" className="text-xs">Trending</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Articles:</span>
                  <span className="ml-1 font-medium">{category.articleCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Views:</span>
                  <span className="ml-1 font-medium">{formatNumber(category.viewCount)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="ml-1 font-medium">{category.averageRating.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Experts:</span>
                  <span className="ml-1 font-medium">{category.expertCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderExpertDirectory = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Subject Matter Experts
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">AI-Matched</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.experts.slice(0, 6).map((expert) => (
            <div key={expert.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{expert.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{expert.primaryExpertise}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {expert.isAvailable && (
                      <Badge variant="outline" className="text-xs">Available</Badge>
                    )}
                    {expert.responseTime && (
                      <span className="text-xs text-muted-foreground">
                        ~{expert.responseTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-muted-foreground">Articles:</span>
                  <span className="ml-1 font-medium">{expert.articlesAuthored}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{expert.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderLearningPaths = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Learning Paths
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Recommended</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.learningPaths.slice(0, 4).map((path) => (
            <div key={path.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{path.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline">{path.pathType.replace('_', ' ')}</Badge>
                  <Badge className={getDifficultyColor(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Modules:</span>
                  <span className="ml-1 font-medium">{path.modules.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-1 font-medium">{path.estimatedHours}h</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Enrolled:</span>
                  <span className="ml-1 font-medium">{path.enrollmentCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{path.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {path.completionRate && (
                    <div className="flex items-center gap-2">
                      <Progress value={path.completionRate * 100} className="w-24 h-2" />
                      <span className="text-xs text-muted-foreground">
                        {(path.completionRate * 100).toFixed(0)}% completion
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Start Learning
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderKnowledgePatterns = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Knowledge Patterns
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">AI-Detected</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.patterns.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-2" />
            <p>Pattern analysis in progress</p>
            <p className="text-sm">New patterns will appear as more content is analyzed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.patterns.slice(0, 3).map((pattern) => (
              <div key={pattern.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{pattern.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{pattern.patternType.replace('_', ' ')}</Badge>
                    <Badge 
                      variant={
                        pattern.strength === 'VERY_STRONG' ? 'default' :
                        pattern.strength === 'STRONG' ? 'secondary' :
                        'outline'
                      }
                      className="text-xs"
                    >
                      {pattern.strength}
                    </Badge>
                  </div>
                </div>
                {pattern.description && (
                  <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>
                    <span>Confidence: {(pattern.confidence * 100).toFixed(0)}%</span>
                    <span className="ml-4">Detected: {formatDate(pattern.detectedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pattern.isValidated && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Validated
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.recentActivity.slice(0, 8).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
              <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {activity.userName && <span>by {activity.userName}</span>}
                  <span>{formatDate(activity.timestamp)}</span>
                  {activity.articleTitle && (
                    <Badge variant="outline" className="text-xs">
                      {activity.articleTitle}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderArticlesList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Knowledge Articles
            {navigationMode === 'assisted' && (
              <Badge variant="outline">Smart Sorted</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INVESTMENT_STRATEGY">Investment Strategy</SelectItem>
                <SelectItem value="MARKET_ANALYSIS">Market Analysis</SelectItem>
                <SelectItem value="PORTFOLIO_MANAGEMENT">Portfolio Management</SelectItem>
                <SelectItem value="DUE_DILIGENCE">Due Diligence</SelectItem>
                <SelectItem value="REGULATORY">Regulatory</SelectItem>
                <SelectItem value="OPERATIONAL">Operational</SelectItem>
                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
                <SelectItem value="EXPERT">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Article Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARTICLE">Article</SelectItem>
                <SelectItem value="CASE_STUDY">Case Study</SelectItem>
                <SelectItem value="BEST_PRACTICE">Best Practice</SelectItem>
                <SelectItem value="LESSON_LEARNED">Lesson Learned</SelectItem>
                <SelectItem value="RESEARCH">Research</SelectItem>
                <SelectItem value="TEMPLATE">Template</SelectItem>
                <SelectItem value="PLAYBOOK">Playbook</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.articles.slice(0, 10).map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold line-clamp-2">{article.title}</h4>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline">{article.category.replace('_', ' ')}</Badge>
                  <Badge className={getDifficultyColor(article.difficulty)}>
                    {article.difficulty}
                  </Badge>
                  <Badge variant={getImportanceColor(article.importance)}>
                    {article.importance}
                  </Badge>
                </div>
              </div>
              {article.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(article.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{article.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{article.likeCount}</span>
                  </div>
                  {article.readingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{article.readingTime} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSearchTrends = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Search Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.searchTrends.slice(0, 6).map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{trend.query}</div>
                <div className="text-sm text-muted-foreground">
                  {trend.searchCount} searches • {(trend.successRate * 100).toFixed(0)}% success rate
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    trend.trend === 'UP' ? 'default' :
                    trend.trend === 'DOWN' ? 'destructive' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {trend.trend}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Knowledge Management
          </h1>
          <p className="text-muted-foreground">
            Knowledge center, institutional memory, and pattern recognition
          </p>
        </div>
        {renderModeSelector()}
      </div>

      {renderStatsCards()}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="experts">Experts</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {renderPopularArticles()}
              {renderCategoryMetrics()}
            </div>
            <div className="space-y-6">
              {renderExpertDirectory()}
              {renderRecentActivity()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          {renderArticlesList()}
        </TabsContent>

        <TabsContent value="experts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Expert Directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expert Management</h3>
                <p>Detailed expert profiles, expertise mapping, and availability management would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <div className="space-y-6">
            {renderLearningPaths()}
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="space-y-6">
            {renderKnowledgePatterns()}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderSearchTrends()}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p>Detailed usage patterns, engagement metrics, and knowledge effectiveness analytics would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}