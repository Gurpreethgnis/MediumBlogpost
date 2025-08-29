import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, MessageCircle, Eye, Bookmark, Tag, Plus } from 'lucide-react';
import { api } from '../services/api';
import { Post, SearchFilters } from '../types';
import PostCard from '../components/PostCard';
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

        This represents a paradigm shift in how we approach drug discovery and demonstrates DemoName's commitment to cutting-edge technology in pharmaceutical research.`,
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
    content: `DemoName Crop Science has achieved a significant milestone in agricultural innovation with the development of BAY-2025-AG-001, a novel pesticide formulation that addresses the growing challenge of pest resistance in modern agriculture.

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

        This represents a significant advancement in diabetes care and demonstrates DemoName's commitment to addressing unmet medical needs in chronic disease management.`,
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
    content: `DemoName's gene therapy division has achieved a groundbreaking advancement in CRISPR-Cas9 delivery technology, opening new possibilities for treating previously untreatable rare genetic diseases.

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

        This breakthrough represents a significant step forward in making gene therapy accessible to patients with rare diseases and demonstrates DemoName's commitment to cutting-edge therapeutic innovation.`,
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

const mockPagination = {
  page: 1,
  limit: 10,
  total: 5,
  pages: 1,
};

const Home: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 10,
    status: 'PUBLISHED',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  // Mock data for development (remove in production)
  const { data, isLoading, error } = useQuery(
    ['posts', filters],
    async () => {
      // Return mock data instead of making API call
      return {
        posts: mockPosts,
        pagination: mockPagination,
      };
      
      // Comment out the real API call for now
      /*
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/posts?${params.toString()}`);
      return response.data;
      */
    },
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev: SearchFilters) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: SearchFilters) => ({ ...prev, page }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading posts</div>;

  const { posts, pagination } = data || { posts: [], pagination: mockPagination };

  return (
    <div className="space-modern-xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="section-title text-4xl md:text-5xl lg:text-6xl">
          DemoName R&D Knowledge Hub
        </h1>
        <p className="section-subtitle text-xl md:text-2xl max-w-4xl mx-auto">
          Share research insights, clinical findings, and scientific discoveries across our global R&D teams
        </p>
        <div className="mt-8">
          <Link
            to="/new"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <Plus className="w-5 h-5" />
            <span>Share Research</span>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              <option value="publishedAt">Published Date</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="filter-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Visibility</label>
            <select
              value={filters.visibility || ''}
              onChange={(e) => handleFilterChange('visibility', e.target.value || undefined)}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="ORG">Organization</option>
              <option value="SPACE">Space</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              className="filter-select"
            />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid-modern grid-cols-responsive">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`pagination-button ${pagination.page === 1 ? 'pagination-button-disabled' : ''}`}
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${page === pagination.page ? 'pagination-button-active' : ''}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`pagination-button ${pagination.page === pagination.pages ? 'pagination-button-disabled' : ''}`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Tag className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="empty-state-title">No research posts found</h3>
          <p className="empty-state-description">
            {filters.search 
              ? `No posts match your search for "${filters.search}"`
              : 'Share your latest research findings, clinical insights, and scientific discoveries with the R&D community'
            }
          </p>
          {!filters.search && (
            <Link to="/new" className="btn-primary">
              Share Research
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
