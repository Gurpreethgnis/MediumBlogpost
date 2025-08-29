import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { Heart, MessageCircle, Eye, Bookmark, Tag, Lock, Users, Globe, ArrowLeft, Send } from 'lucide-react';
import { api } from '../services/api';
import { Post, Comment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data for development (remove in production)
const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Breakthrough in Cardiovascular Drug Development: Novel Mechanism of Action Identified',
    slug: 'breakthrough-cardiovascular-drug-development-novel-mechanism',
    excerpt: 'Our research team has identified a promising new mechanism of action for treating heart failure that could revolutionize cardiovascular therapeutics. Early preclinical results show significant improvement in cardiac function.',
    content: `Our research team at DemoName Pharmaceuticals has made a significant breakthrough in cardiovascular drug development. Through extensive preclinical studies, we've identified a novel mechanism of action that targets the underlying pathophysiology of heart failure.

## Key Findings

The research focused on modulating the cardiac fibroblast activation pathway, which plays a crucial role in cardiac remodeling and fibrosis. Our lead compound, BAY-2025-001, demonstrated:

- **40% reduction** in cardiac fibrosis in animal models
- **Improved ejection fraction** by 25% compared to standard care
- **Favorable safety profile** with no significant adverse effects

## Clinical Implications

This discovery opens new therapeutic avenues for:
- Heart failure with preserved ejection fraction (HFpEF)
- Post-myocardial infarction remodeling
- Diabetic cardiomyopathy

## Next Steps

Phase I clinical trials are scheduled to begin in Q2 2026, with enrollment of 48 healthy volunteers to assess safety and pharmacokinetics.

## Team Recognition

This breakthrough represents the collaborative effort of our global R&D teams across:
- Berlin (Lead Discovery)
- Wuppertal (Preclinical Development)
- Berkeley (Translational Medicine)

We're excited to share this progress and welcome collaboration from other R&D teams interested in cardiovascular therapeutics.`,
    status: 'PUBLISHED',
    visibility: 'ORG',
    publishedAt: '2025-08-29',
    authorId: 'mock-user-1',
    spaceId: undefined,
    featuredImage: undefined,
    tags: [
      { id: '1', name: 'Cardiovascular', slug: 'cardiovascular', createdAt: '2025-08-29' },
      { id: '2', name: 'Drug Development', slug: 'drug-development', createdAt: '2025-08-29' },
      { id: '3', name: 'Preclinical Research', slug: 'preclinical-research', createdAt: '2025-08-29' },
      { id: '4', name: 'Heart Failure', slug: 'heart-failure', createdAt: '2025-08-29' }
    ],
    createdAt: '2025-08-29',
    updatedAt: '2025-08-29',
    author: {
      id: 'mock-user-1',
      email: 'dr.schmidt@bayer.com',
      name: 'Dr. Anna Schmidt',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-29',
      createdAt: '2025-08-29',
      updatedAt: '2025-08-29',
    },
    _count: {
      claps: 42,
      comments: 8,
      views: 156,
    },
    invitees: [],
  },
  {
    id: '2',
    title: 'AI-Driven Drug Discovery: Accelerating Target Identification in Oncology',
    slug: 'ai-driven-drug-discovery-oncology-target-identification',
    excerpt: 'Leveraging machine learning algorithms to identify novel drug targets in triple-negative breast cancer, reducing discovery timelines by 60%.',
    content: `Our computational biology team has successfully implemented an AI-driven approach to drug target identification that's revolutionizing our oncology pipeline.

## Methodology

We developed a proprietary machine learning algorithm that integrates:
- Multi-omics data analysis
- Protein-protein interaction networks
- Clinical outcome correlations
- Drug response patterns

## Results

The AI platform identified 12 novel drug targets in triple-negative breast cancer, with:
- **60% reduction** in target discovery timeline
- **85% accuracy** in predicting druggable targets
- **3 new lead compounds** already in preclinical development

## Technology Stack

Our platform leverages:
- Deep learning neural networks
- Graph neural networks for protein interactions
- Natural language processing for literature mining
- High-performance computing infrastructure

## Collaboration Opportunities

We're actively seeking partnerships with:
- Computational biology teams
- Data science experts
- Clinical oncology specialists

This represents a paradigm shift in how we approach drug discovery and demonstrates Bayer's commitment to cutting-edge technology in pharmaceutical research.`,
    status: 'PUBLISHED',
    visibility: 'ORG',
    publishedAt: '2025-08-28',
    authorId: 'mock-user-2',
    spaceId: undefined,
    featuredImage: undefined,
    tags: [
      { id: '5', name: 'Oncology', slug: 'oncology', createdAt: '2025-08-28' },
      { id: '6', name: 'AI/ML', slug: 'ai-ml', createdAt: '2025-08-28' },
      { id: '7', name: 'Computational Biology', slug: 'computational-biology', createdAt: '2025-08-28' },
      { id: '8', name: 'Breast Cancer', slug: 'breast-cancer', createdAt: '2025-08-28' }
    ],
    createdAt: '2025-08-28',
    updatedAt: '2025-08-28',
    author: {
      id: 'mock-user-2',
      email: 'dr.chen@bayer.com',
      name: 'Dr. Michael Chen',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-28',
      createdAt: '2025-08-28',
      updatedAt: '2025-08-28',
    },
    _count: {
      claps: 28,
      comments: 5,
      views: 89,
    },
    invitees: [],
  },
  {
    id: '3',
    title: 'Novel Pesticide Formulation Shows 95% Efficacy Against Resistant Crop Pests',
    slug: 'novel-pesticide-formulation-resistant-crop-pests',
    excerpt: 'Our crop science division has developed a breakthrough pesticide formulation that maintains high efficacy against increasingly resistant agricultural pests while reducing environmental impact.',
    content: `Bayer Crop Science has achieved a significant milestone in agricultural innovation with the development of BAY-2025-AG-001, a novel pesticide formulation that addresses the growing challenge of pest resistance in modern agriculture.

## Innovation Highlights

The new formulation combines three complementary active ingredients:
- **Mode of Action A**: Targets sodium channels in pest nervous systems
- **Mode of Action B**: Inhibits chitin synthesis for growth disruption
- **Mode of Action C**: Disrupts mitochondrial function for energy depletion

## Field Trial Results

Extensive field trials across 12 countries demonstrated:
- **95% efficacy** against resistant strains of major crop pests
- **40% reduction** in application frequency compared to current standards
- **60% lower environmental impact** with improved biodegradability
- **Enhanced crop yield** by 15-25% in treated fields

## Target Crops & Pests

Primary applications include:
- **Corn**: European corn borer, corn earworm
- **Soybeans**: Soybean aphid, stink bugs
- **Cotton**: Boll weevil, cotton bollworm
- **Wheat**: Hessian fly, wheat stem sawfly

## Regulatory Status

- **EU**: Phase II review in progress
- **US**: EPA registration expected Q3 2026
- **Brazil**: ANVISA approval pending
- **China**: Field trials completed successfully

## Sustainability Impact

This innovation supports Bayer's commitment to:
- Reducing pesticide resistance development
- Minimizing environmental footprint
- Supporting food security
- Promoting sustainable agriculture practices

The formulation represents a significant step forward in integrated pest management and demonstrates our leadership in agricultural innovation.`,
    status: 'PUBLISHED',
    visibility: 'ORG',
    publishedAt: '2025-08-27',
    authorId: 'mock-user-3',
    spaceId: undefined,
    featuredImage: undefined,
    tags: [
      { id: '9', name: 'Crop Science', slug: 'crop-science', createdAt: '2025-08-27' },
      { id: '10', name: 'Pesticides', slug: 'pesticides', createdAt: '2025-08-27' },
      { id: '11', name: 'Agriculture', slug: 'agriculture', createdAt: '2025-08-27' },
      { id: '12', name: 'Sustainability', slug: 'sustainability', createdAt: '2025-08-27' }
    ],
    createdAt: '2025-08-27',
    updatedAt: '2025-08-27',
    author: {
      id: 'mock-user-3',
      email: 'dr.rodriguez@bayer.com',
      name: 'Dr. Maria Rodriguez',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-27',
      createdAt: '2025-08-27',
      updatedAt: '2025-08-27',
    },
    _count: {
      claps: 35,
      comments: 12,
      views: 203,
    },
    invitees: [],
  },
  {
    id: '4',
    title: 'Clinical Trial Update: Phase II Results for Novel Diabetes Treatment',
    slug: 'clinical-trial-update-phase-ii-diabetes-treatment',
    excerpt: 'Promising results from our Phase II clinical trial of BAY-2025-DM-001, a novel dual-action therapy for type 2 diabetes that targets both insulin resistance and pancreatic function.',
    content: `We're excited to share the results of our Phase II clinical trial for BAY-2025-DM-001, a first-in-class dual-action therapy for type 2 diabetes that represents a paradigm shift in diabetes treatment.

## Trial Design

**Study**: BAY-DM-2025-002 (Phase II, Double-blind, Placebo-controlled)
**Duration**: 24 weeks
**Participants**: 240 patients with inadequately controlled type 2 diabetes
**Dosage**: Once-daily oral administration

## Primary Endpoints Met

The trial successfully achieved all primary endpoints:
- **HbA1c reduction**: 1.8% vs. 0.3% placebo (p < 0.001)
- **Fasting glucose**: 45 mg/dL reduction vs. 8 mg/dL placebo
- **Body weight**: 3.2 kg reduction vs. 0.1 kg placebo

## Secondary Endpoints

Additional benefits observed:
- **Insulin sensitivity**: 35% improvement (HOMA-IR)
- **Beta-cell function**: 28% enhancement (C-peptide response)
- **Lipid profile**: 15% reduction in triglycerides
- **Blood pressure**: 8/5 mmHg reduction

## Safety Profile

The treatment demonstrated excellent safety:
- **Adverse events**: Similar to placebo group
- **No serious adverse events** related to treatment
- **Well-tolerated** with minimal side effects
- **No cardiovascular safety concerns**

## Mechanism of Action

BAY-2025-DM-001 works through dual pathways:
1. **Insulin Sensitization**: Activates PPAR-γ receptors
2. **Pancreatic Protection**: Inhibits beta-cell apoptosis
3. **Metabolic Enhancement**: Improves glucose utilization

## Next Steps

- **Phase III planning**: Initiated for Q1 2026
- **Regulatory discussions**: FDA pre-submission meeting scheduled
- **Manufacturing scale-up**: Process validation in progress
- **Market access strategy**: Health economics studies planned

This represents a significant advancement in diabetes care and demonstrates Bayer's commitment to addressing unmet medical needs in chronic disease management.`,
    status: 'PUBLISHED',
    visibility: 'ORG',
    publishedAt: '2025-08-26',
    authorId: 'mock-user-4',
    spaceId: undefined,
    featuredImage: undefined,
    tags: [
      { id: '13', name: 'Diabetes', slug: 'diabetes', createdAt: '2025-08-26' },
      { id: '14', name: 'Clinical Trials', slug: 'clinical-trials', createdAt: '2025-08-26' },
      { id: '15', name: 'Phase II', slug: 'phase-ii', createdAt: '2025-08-26' },
      { id: '16', name: 'Metabolic Disease', slug: 'metabolic-disease', createdAt: '2025-08-26' }
    ],
    createdAt: '2025-08-26',
    updatedAt: '2025-08-26',
    author: {
      id: 'mock-user-4',
      email: 'dr.tanaka@bayer.com',
      name: 'Dr. Hiroshi Tanaka',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-26',
      createdAt: '2025-08-26',
      updatedAt: '2025-08-26',
    },
    _count: {
      claps: 67,
      comments: 18,
      views: 312,
    },
    invitees: [],
  },
  {
    id: '5',
    title: 'Breakthrough in Gene Therapy: CRISPR-Cas9 Delivery System for Rare Diseases',
    slug: 'breakthrough-gene-therapy-crispr-cas9-rare-diseases',
    excerpt: 'Our gene therapy team has developed a novel lipid nanoparticle delivery system for CRISPR-Cas9 that shows unprecedented efficiency in targeting rare genetic disorders.',
    content: `Bayer's gene therapy division has achieved a groundbreaking advancement in CRISPR-Cas9 delivery technology, opening new possibilities for treating previously untreatable rare genetic diseases.

## Technology Innovation

We've developed a proprietary lipid nanoparticle (LNP) system that:
- **Targets specific cell types** with 90% precision
- **Achieves 85% gene editing efficiency** in vivo
- **Minimizes off-target effects** to <0.1%
- **Enables repeat dosing** without immune response

## Target Diseases

Initial focus on rare genetic disorders:
- **Duchenne Muscular Dystrophy**: Exon skipping therapy
- **Cystic Fibrosis**: CFTR gene correction
- **Sickle Cell Disease**: Hemoglobin gene editing
- **Huntington's Disease**: HTT gene silencing

## Preclinical Results

Animal model studies demonstrated:
- **Muscle regeneration**: 70% improvement in DMD models
- **Lung function**: 60% restoration in CF models
- **Blood cell morphology**: 90% correction in SCD models
- **Neurological function**: 45% improvement in HD models

## Delivery System Advantages

Our LNP technology provides:
- **Tissue-specific targeting** through receptor binding
- **Controlled release** for sustained therapeutic effect
- **Biodegradable components** for safety
- **Scalable manufacturing** for commercial production

## Regulatory Pathway

- **FDA**: Pre-IND meeting completed successfully
- **EMA**: Scientific advice requested
- **First IND**: Expected Q4 2026 for DMD program
- **Orphan drug designation**: Applied for all target diseases

## Collaboration Opportunities

We're actively seeking partnerships with:
- Academic institutions with rare disease expertise
- Patient advocacy groups
- Regulatory consultants
- Manufacturing partners

This breakthrough represents a significant step forward in making gene therapy accessible to patients with rare diseases and demonstrates Bayer's commitment to cutting-edge therapeutic innovation.`,
    status: 'PUBLISHED',
    visibility: 'ORG',
    publishedAt: '2025-08-25',
    authorId: 'mock-user-5',
    spaceId: undefined,
    featuredImage: undefined,
    tags: [
      { id: '17', name: 'Gene Therapy', slug: 'gene-therapy', createdAt: '2025-08-25' },
      { id: '18', name: 'CRISPR', slug: 'crispr', createdAt: '2025-08-25' },
      { id: '19', name: 'Rare Diseases', slug: 'rare-diseases', createdAt: '2025-08-25' },
      { id: '20', name: 'Biotechnology', slug: 'biotechnology', createdAt: '2025-08-25' }
    ],
    createdAt: '2025-08-25',
    updatedAt: '2025-08-25',
    author: {
      id: 'mock-user-5',
      email: 'dr.patel@bayer.com',
      name: 'Dr. Priya Patel',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-25',
      createdAt: '2025-08-25',
      updatedAt: '2025-08-25',
    },
    _count: {
      claps: 89,
      comments: 23,
      views: 445,
    },
    invitees: [],
  },
];

// Mock comments data
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is a fascinating breakthrough! The 40% reduction in cardiac fibrosis is impressive. Have you considered exploring this mechanism in other cardiovascular conditions?',
    status: 'ACTIVE',
    authorId: 'mock-user-2',
    postId: '1',
    author: {
      id: 'mock-user-2',
      email: 'dr.chen@bayer.com',
      name: 'Dr. Michael Chen',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-28',
      createdAt: '2025-08-28',
      updatedAt: '2025-08-28',
    },
    replies: [],
    createdAt: '2025-08-29T10:00:00Z',
    updatedAt: '2025-08-29T10:00:00Z',
  },
  {
    id: '2',
    content: 'Excellent work! The preclinical data looks very promising. When do you anticipate starting Phase I trials?',
    status: 'ACTIVE',
    authorId: 'mock-user-3',
    postId: '1',
    author: {
      id: 'mock-user-3',
      email: 'dr.rodriguez@bayer.com',
      name: 'Dr. Maria Rodriguez',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-27',
      createdAt: '2025-08-27',
      updatedAt: '2025-08-27',
    },
    replies: [],
    createdAt: '2025-08-29T09:30:00Z',
    updatedAt: '2025-08-29T09:30:00Z',
  },
  {
    id: '3',
    content: 'This could revolutionize heart failure treatment. The dual mechanism approach is innovative.',
    status: 'ACTIVE',
    authorId: 'mock-user-4',
    postId: '1',
    author: {
      id: 'mock-user-4',
      email: 'dr.tanaka@bayer.com',
      name: 'Dr. Hiroshi Tanaka',
      avatar: undefined,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: '2025-08-26',
      createdAt: '2025-08-26',
      updatedAt: '2025-08-26',
    },
    replies: [],
    createdAt: '2025-08-29T08:45:00Z',
    updatedAt: '2025-08-29T08:45:00Z',
  },
];

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // Mock data for development (remove in production)
  const { data: post, isLoading, error } = useQuery(
    ['post', id],
    async () => {
      // Find post by slug instead of making API call
      const foundPost = mockPosts.find(p => p.slug === id);
      if (!foundPost) {
        throw new Error('Post not found');
      }
      return foundPost;
      
      // Comment out the real API call for now
      /*
      const response = await api.get(`/posts/${id}`);
      return response.data.post;
      */
    },
    {
      enabled: !!id,
    }
  );

  // Convert markdown to HTML for better rendering
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li class="ml-6 mb-2">$1. $2</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
      .replace(/^(.+)$/gm, '<p class="mb-4 leading-relaxed">$1</p>');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In production, this would update the database
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In production, this would update the database
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      status: 'ACTIVE',
      authorId: 'mock-user-1', // Current user
      postId: post?.id || '',
      author: {
        id: 'mock-user-1',
        email: 'dr.schmidt@bayer.com',
        name: 'Dr. Anna Schmidt',
        avatar: undefined,
        role: 'ADMIN',
        isActive: true,
        lastLoginAt: '2025-08-29',
        createdAt: '2025-08-29',
        updatedAt: '2025-08-29',
      },
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    // In production, this would save to the database
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading post</div>;
  if (!post) return <div>Post not found</div>;

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'PRIVATE':
        return <Lock className="w-5 h-5 text-red-500" />;
      case 'SPACE':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'ORG':
        return <Globe className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getVisibilityText = () => {
    switch (post.visibility) {
      case 'PRIVATE':
        return 'Private';
      case 'SPACE':
        return post.space?.name || 'Space';
      case 'ORG':
        return 'Organization';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Posts</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
              ) : (
                <span className="text-green-600 font-medium text-lg">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">{post.author.name}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                {post.publishedAt && (
                  <>
                    <span>•</span>
                    <span>Published {format(new Date(post.publishedAt), 'MMM d, yyyy')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getVisibilityIcon()}
            <span className="text-sm text-gray-500">{getVisibilityText()}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        )}

        {post.featuredImage && (
          <div className="mb-6">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </div>

      {/* Interactive Footer */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? post._count.claps + 1 : post._count.claps}</span>
            </button>
                          <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post._count.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post._count.views}</span>
              </div>
          </div>
          
          <button 
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isBookmarked 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-medium text-sm">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this research..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm">
                  {comment.author.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
