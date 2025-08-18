/**
 * Format Optimization Service
 * Provides format-specific optimization for PDF, DOCX, HTML, and Markdown outputs
 * with professional formatting, layout optimization, and industry standards
 */

import { 
  WorkProduct, 
  DocumentSection, 
  ExportFormat,
  ExportOptions
} from '@/types/work-product';

export interface FormatOptimizationOptions {
  // Visual formatting
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    headingScale: number[];
  };
  
  // Layout settings
  layout: {
    margins: { top: number; bottom: number; left: number; right: number };
    pageSize: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    columns: number;
    spacing: {
      paragraphs: number;
      sections: number;
      lists: number;
    };
  };
  
  // Content structure
  structure: {
    includeTableOfContents: boolean;
    includeExecutiveSummary: boolean;
    includeAppendices: boolean;
    sectionNumbering: boolean;
    pageNumbers: boolean;
    headers: boolean;
    footers: boolean;
  };
  
  // Industry-specific formatting
  industry: {
    sector: string;
    complianceLevel: 'standard' | 'enhanced' | 'regulatory';
    brandingLevel: 'minimal' | 'standard' | 'comprehensive';
    confidentialityLevel: 'internal' | 'confidential' | 'restricted';
  };
  
  // Export-specific options
  exportOptions: {
    quality: 'draft' | 'standard' | 'high' | 'print';
    compression: boolean;
    watermark?: string;
    password?: string;
    allowPrinting: boolean;
    allowCopying: boolean;
    allowEditing: boolean;
  };
}

export interface OptimizedFormatResult {
  content: string;
  metadata: {
    format: ExportFormat;
    fileSize: number;
    pageCount: number;
    wordCount: number;
    optimizationsApplied: string[];
    qualityScore: number;
    processingTime: number;
  };
  downloadUrl: string;
  previewUrl?: string;
  shareableUrl?: string;
}

export interface FormatTemplate {
  id: string;
  name: string;
  format: ExportFormat;
  industry: string;
  description: string;
  defaultOptions: FormatOptimizationOptions;
  previewImage?: string;
  usageCount: number;
  rating: number;
  features: string[];
}

export class FormatOptimizationService {
  private static instance: FormatOptimizationService;
  private formatTemplates: Map<string, FormatTemplate> = new Map();

  static getInstance(): FormatOptimizationService {
    if (!FormatOptimizationService.instance) {
      FormatOptimizationService.instance = new FormatOptimizationService();
    }
    return FormatOptimizationService.instance;
  }

  constructor() {
    this.initializeFormatTemplates();
  }

  /**
   * Optimize work product for specific format
   */
  async optimizeForFormat(
    workProduct: WorkProduct,
    targetFormat: ExportFormat,
    options?: Partial<FormatOptimizationOptions>
  ): Promise<OptimizedFormatResult> {
    const startTime = Date.now();
    
    // Get default options for format
    const defaultOptions = this.getDefaultOptionsForFormat(targetFormat);
    const finalOptions = { ...defaultOptions, ...options };

    // Apply format-specific optimizations
    const optimizedContent = await this.applyFormatOptimizations(
      workProduct, 
      targetFormat, 
      finalOptions
    );

    // Generate metadata
    const metadata = {
      format: targetFormat,
      fileSize: this.estimateFileSize(optimizedContent, targetFormat),
      pageCount: this.estimatePageCount(optimizedContent, finalOptions),
      wordCount: this.calculateWordCount(optimizedContent),
      optimizationsApplied: this.getAppliedOptimizations(targetFormat, finalOptions),
      qualityScore: this.calculateFormatQuality(optimizedContent, targetFormat),
      processingTime: Date.now() - startTime
    };

    // Generate URLs
    const fileId = `${workProduct.id}-${targetFormat.toLowerCase()}-${Date.now()}`;
    const downloadUrl = `/api/documents/download/${fileId}`;
    const previewUrl = targetFormat === 'HTML' ? `/api/documents/preview/${fileId}` : undefined;

    return {
      content: optimizedContent,
      metadata,
      downloadUrl,
      previewUrl,
      shareableUrl: `/api/documents/share/${fileId}`
    };
  }

  /**
   * Get available format templates
   */
  getFormatTemplates(format?: ExportFormat, industry?: string): FormatTemplate[] {
    let templates = Array.from(this.formatTemplates.values());
    
    if (format) {
      templates = templates.filter(template => template.format === format);
    }
    
    if (industry) {
      templates = templates.filter(template => 
        template.industry === industry || template.industry === 'general'
      );
    }
    
    return templates.sort((a, b) => b.rating - a.rating);
  }

  /**
   * PDF-specific optimization
   */
  async optimizeForPDF(
    workProduct: WorkProduct,
    options: FormatOptimizationOptions
  ): Promise<string> {
    let pdfContent = this.generatePDFStructure(workProduct, options);
    
    // Apply PDF-specific optimizations
    pdfContent = this.optimizePDFLayout(pdfContent, options);
    pdfContent = this.addPDFMetadata(pdfContent, workProduct, options);
    pdfContent = this.optimizePDFTypography(pdfContent, options);
    pdfContent = this.addPDFNavigation(pdfContent, workProduct, options);
    
    return pdfContent;
  }

  /**
   * DOCX-specific optimization
   */
  async optimizeForDOCX(
    workProduct: WorkProduct,
    options: FormatOptimizationOptions
  ): Promise<string> {
    let docxContent = this.generateDOCXStructure(workProduct, options);
    
    // Apply DOCX-specific optimizations
    docxContent = this.optimizeDOCXStyles(docxContent, options);
    docxContent = this.addDOCXCollaboration(docxContent, workProduct, options);
    docxContent = this.optimizeDOCXTables(docxContent, options);
    docxContent = this.addDOCXComments(docxContent, workProduct);
    
    return docxContent;
  }

  /**
   * HTML-specific optimization
   */
  async optimizeForHTML(
    workProduct: WorkProduct,
    options: FormatOptimizationOptions
  ): Promise<string> {
    let htmlContent = this.generateHTMLStructure(workProduct, options);
    
    // Apply HTML-specific optimizations
    htmlContent = this.optimizeHTMLAccessibility(htmlContent, options);
    htmlContent = this.addHTMLInteractivity(htmlContent, workProduct, options);
    htmlContent = this.optimizeHTMLResponsive(htmlContent, options);
    htmlContent = this.addHTMLSEO(htmlContent, workProduct);
    
    return htmlContent;
  }

  /**
   * Markdown-specific optimization
   */
  async optimizeForMarkdown(
    workProduct: WorkProduct,
    options: FormatOptimizationOptions
  ): Promise<string> {
    let markdownContent = this.generateMarkdownStructure(workProduct, options);
    
    // Apply Markdown-specific optimizations
    markdownContent = this.optimizeMarkdownSyntax(markdownContent);
    markdownContent = this.addMarkdownMetadata(markdownContent, workProduct);
    markdownContent = this.optimizeMarkdownTables(markdownContent);
    markdownContent = this.addMarkdownTOC(markdownContent, workProduct);
    
    return markdownContent;
  }

  // Private helper methods

  private initializeFormatTemplates(): void {
    const templates: FormatTemplate[] = [
      {
        id: 'pdf-executive-summary',
        name: 'Executive Summary (PDF)',
        format: 'PDF',
        industry: 'private-equity',
        description: 'Professional PDF format optimized for executive presentations',
        defaultOptions: this.getExecutivePDFOptions(),
        usageCount: 156,
        rating: 4.8,
        features: ['Executive formatting', 'Charts optimization', 'Print-ready', 'Professional typography']
      },
      {
        id: 'docx-collaborative',
        name: 'Collaborative Document (DOCX)',
        format: 'DOCX',
        industry: 'general',
        description: 'DOCX format optimized for team collaboration and review',
        defaultOptions: this.getCollaborativeDOCXOptions(),
        usageCount: 243,
        rating: 4.6,
        features: ['Comment-ready', 'Track changes', 'Review workflow', 'Team sharing']
      },
      {
        id: 'html-interactive',
        name: 'Interactive Report (HTML)',
        format: 'HTML',
        industry: 'technology',
        description: 'Interactive HTML format with charts and data visualization',
        defaultOptions: this.getInteractiveHTMLOptions(),
        usageCount: 87,
        rating: 4.7,
        features: ['Interactive charts', 'Responsive design', 'Web sharing', 'Search functionality']
      },
      {
        id: 'markdown-documentation',
        name: 'Technical Documentation (Markdown)',
        format: 'MARKDOWN',
        industry: 'technology',
        description: 'Clean Markdown format for technical documentation and version control',
        defaultOptions: this.getTechnicalMarkdownOptions(),
        usageCount: 124,
        rating: 4.5,
        features: ['Version control ready', 'GitHub compatible', 'Clean syntax', 'Developer friendly']
      }
    ];

    templates.forEach(template => {
      this.formatTemplates.set(template.id, template);
    });
  }

  private getDefaultOptionsForFormat(format: ExportFormat): FormatOptimizationOptions {
    const baseOptions: FormatOptimizationOptions = {
      typography: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 11,
        lineHeight: 1.4,
        headingScale: [24, 20, 16, 14, 12]
      },
      layout: {
        margins: { top: 1, bottom: 1, left: 1, right: 1 },
        pageSize: 'A4',
        orientation: 'portrait',
        columns: 1,
        spacing: { paragraphs: 6, sections: 12, lists: 4 }
      },
      structure: {
        includeTableOfContents: true,
        includeExecutiveSummary: true,
        includeAppendices: false,
        sectionNumbering: true,
        pageNumbers: true,
        headers: true,
        footers: true
      },
      industry: {
        sector: 'private-equity',
        complianceLevel: 'standard',
        brandingLevel: 'standard',
        confidentialityLevel: 'confidential'
      },
      exportOptions: {
        quality: 'high',
        compression: true,
        allowPrinting: true,
        allowCopying: true,
        allowEditing: false
      }
    };

    // Format-specific adjustments
    switch (format) {
      case 'PDF':
        baseOptions.exportOptions.quality = 'print';
        baseOptions.structure.pageNumbers = true;
        break;
      case 'DOCX':
        baseOptions.exportOptions.allowEditing = true;
        baseOptions.structure.includeTableOfContents = false;
        break;
      case 'HTML':
        baseOptions.layout.pageSize = 'A4'; // Will be ignored for HTML
        baseOptions.structure.pageNumbers = false;
        break;
      case 'MARKDOWN':
        baseOptions.structure.pageNumbers = false;
        baseOptions.structure.headers = false;
        baseOptions.structure.footers = false;
        break;
    }

    return baseOptions;
  }

  private async applyFormatOptimizations(
    workProduct: WorkProduct,
    format: ExportFormat,
    options: FormatOptimizationOptions
  ): Promise<string> {
    switch (format) {
      case 'PDF':
        return this.optimizeForPDF(workProduct, options);
      case 'DOCX':
        return this.optimizeForDOCX(workProduct, options);
      case 'HTML':
        return this.optimizeForHTML(workProduct, options);
      case 'MARKDOWN':
        return this.optimizeForMarkdown(workProduct, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private generatePDFStructure(workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    let content = `%PDF-1.4
% Professional PDF Document - ${workProduct.title}

<<PDF METADATA>>
/Title (${workProduct.title})
/Author (DD-Hybrid Content Generator)
/Subject (${workProduct.metadata.projectContext?.sector || 'Investment Analysis'})
/Creator (DD-Hybrid Platform)
/CreationDate (${new Date().toISOString()})

<<PDF CONTENT>>
`;

    // Add cover page
    if (options.structure.includeExecutiveSummary) {
      content += this.generatePDFCoverPage(workProduct, options);
    }

    // Add table of contents
    if (options.structure.includeTableOfContents) {
      content += this.generatePDFTableOfContents(workProduct);
    }

    // Add sections with proper PDF formatting
    workProduct.sections.forEach((section, index) => {
      content += this.formatSectionForPDF(section, index + 1, options);
    });

    return content;
  }

  private generateDOCXStructure(workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    let content = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
`;

    // Add document properties
    content += `
    <w:sectPr>
      <w:pgSz w:w="${options.layout.pageSize === 'A4' ? '11906' : '12240'}" 
              w:h="${options.layout.pageSize === 'A4' ? '16838' : '15840'}"/>
      <w:pgMar w:top="${options.layout.margins.top * 1440}" 
               w:right="${options.layout.margins.right * 1440}"
               w:bottom="${options.layout.margins.bottom * 1440}" 
               w:left="${options.layout.margins.left * 1440}"/>
    </w:sectPr>
`;

    // Add title
    content += `
    <w:p>
      <w:pPr><w:pStyle w:val="Title"/></w:pPr>
      <w:r><w:t>${workProduct.title}</w:t></w:r>
    </w:p>
`;

    // Add sections
    workProduct.sections.forEach(section => {
      content += this.formatSectionForDOCX(section, options);
    });

    content += `
  </w:body>
</w:document>`;

    return content;
  }

  private generateHTMLStructure(workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    let content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${workProduct.title}</title>
  <meta name="description" content="${workProduct.title} - Investment Analysis Document">
  <meta name="keywords" content="investment, analysis, ${workProduct.metadata.projectContext?.sector}">
  
  <style>
    ${this.generateHTMLStyles(options)}
  </style>
  
  <script>
    ${this.generateHTMLScripts()}
  </script>
</head>
<body>
  <div class="document-container">
    <header class="document-header">
      <h1>${workProduct.title}</h1>
      <div class="document-meta">
        <span class="sector">${workProduct.metadata.projectContext?.sector || 'Investment Analysis'}</span>
        <span class="date">${new Date().toLocaleDateString()}</span>
        <span class="confidentiality">${options.industry.confidentialityLevel.toUpperCase()}</span>
      </div>
    </header>
    
    <nav class="table-of-contents">
      <h2>Table of Contents</h2>
      <ul>
        ${workProduct.sections.map((section, index) => 
          `<li><a href="#section-${index + 1}">${section.title}</a></li>`
        ).join('')}
      </ul>
    </nav>
    
    <main class="document-content">
`;

    // Add sections
    workProduct.sections.forEach((section, index) => {
      content += this.formatSectionForHTML(section, index + 1, options);
    });

    content += `
    </main>
    
    <footer class="document-footer">
      <p>Generated by DD-Hybrid Platform | ${new Date().toLocaleDateString()} | ${options.industry.confidentialityLevel.toUpperCase()}</p>
    </footer>
  </div>
</body>
</html>`;

    return content;
  }

  private generateMarkdownStructure(workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    let content = `# ${workProduct.title}

---

**Document Information**
- **Sector:** ${workProduct.metadata.projectContext?.sector || 'Investment Analysis'}
- **Generated:** ${new Date().toLocaleDateString()}
- **Confidentiality:** ${options.industry.confidentialityLevel.toUpperCase()}
- **Word Count:** ${workProduct.wordCount || 0}

---

`;

    // Add table of contents
    if (options.structure.includeTableOfContents) {
      content += `## Table of Contents

`;
      workProduct.sections.forEach((section, index) => {
        const anchor = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        content += `${index + 1}. [${section.title}](#${anchor})\n`;
      });
      content += '\n---\n\n';
    }

    // Add sections
    workProduct.sections.forEach(section => {
      content += this.formatSectionForMarkdown(section, options);
    });

    return content;
  }

  // PDF formatting methods
  private generatePDFCoverPage(workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    return `
<<PDF COVER PAGE>>
<< Page Setup >>
/MediaBox [0 0 595 842]  % A4 size
/Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >>

<< Content >>
BT
/F1 24 Tf
100 750 Td
(${workProduct.title}) Tj
0 -50 Td
/F1 14 Tf
(${workProduct.metadata.projectContext?.sector || 'Investment Analysis'}) Tj
0 -30 Td
(${new Date().toLocaleDateString()}) Tj
0 -30 Td
(${options.industry.confidentialityLevel.toUpperCase()}) Tj
ET

<< Page Break >>
`;
  }

  private generatePDFTableOfContents(workProduct: WorkProduct): string {
    let toc = `
<<PDF TABLE OF CONTENTS>>
BT
/F1 18 Tf
100 750 Td
(Table of Contents) Tj
ET

`;

    workProduct.sections.forEach((section, index) => {
      toc += `
BT
/F1 12 Tf
100 ${700 - (index * 20)} Td
(${index + 1}. ${section.title}) Tj
ET
`;
    });

    return toc + '\n<< Page Break >>\n';
  }

  private formatSectionForPDF(section: DocumentSection, sectionNumber: number, options: FormatOptimizationOptions): string {
    return `
<<PDF SECTION ${sectionNumber}>>
BT
/F1 16 Tf
100 750 Td
(${sectionNumber}. ${section.title}) Tj
ET

BT
/F1 11 Tf
100 720 Td
${this.formatContentForPDF(section.content)}
ET

<< Section Break >>
`;
  }

  private formatContentForPDF(content: string): string {
    // Convert markdown/text to PDF text commands
    return content
      .replace(/#{1,6}\s+(.+)/g, (match, title) => `(${title}) Tj 0 -20 Td`)
      .replace(/\*\*(.+?)\*\*/g, '($1) Tj')  // Bold text
      .replace(/\*(.+?)\*/g, '($1) Tj')       // Italic text
      .replace(/\n/g, ' 0 -15 Td ')           // Line breaks
      .substring(0, 1000); // Truncate for demo
  }

  // DOCX formatting methods
  private formatSectionForDOCX(section: DocumentSection, options: FormatOptimizationOptions): string {
    return `
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>${section.title}</w:t></w:r>
    </w:p>
    
    ${this.formatContentForDOCX(section.content)}
`;
  }

  private formatContentForDOCX(content: string): string {
    // Convert content to DOCX XML format
    const paragraphs = content.split('\n\n');
    return paragraphs.map(paragraph => `
    <w:p>
      <w:r><w:t>${paragraph.replace(/[<>&]/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char] || char))}</w:t></w:r>
    </w:p>
`).join('');
  }

  private optimizeDOCXStyles(content: string, options: FormatOptimizationOptions): string {
    // Add DOCX style definitions
    const styles = `
    <w:styles>
      <w:style w:type="paragraph" w:styleId="Title">
        <w:name w:val="Title"/>
        <w:rPr>
          <w:sz w:val="${options.typography.headingScale[0] * 2}"/>
          <w:b/>
        </w:rPr>
      </w:style>
      <w:style w:type="paragraph" w:styleId="Heading1">
        <w:name w:val="Heading 1"/>
        <w:rPr>
          <w:sz w:val="${options.typography.headingScale[1] * 2}"/>
          <w:b/>
        </w:rPr>
      </w:style>
    </w:styles>
`;
    return content.replace('<w:document', styles + '<w:document');
  }

  private addDOCXCollaboration(content: string, workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    // Add collaboration features like comments and track changes
    return content.replace('</w:body>', `
    <w:commentRangeStart w:id="0"/>
    <w:r><w:t>Review note: Document generated automatically</w:t></w:r>
    <w:commentRangeEnd w:id="0"/>
    </w:body>`);
  }

  private optimizeDOCXTables(content: string, options: FormatOptimizationOptions): string {
    // Optimize table formatting for DOCX
    return content; // Placeholder implementation
  }

  private addDOCXComments(content: string, workProduct: WorkProduct): string {
    // Add automated comments for review
    return content; // Placeholder implementation
  }

  // HTML formatting methods
  private formatSectionForHTML(section: DocumentSection, sectionNumber: number, options: FormatOptimizationOptions): string {
    return `
    <section id="section-${sectionNumber}" class="document-section">
      <h2>${sectionNumber}. ${section.title}</h2>
      <div class="section-content">
        ${this.formatContentForHTML(section.content)}
      </div>
    </section>
`;
  }

  private formatContentForHTML(content: string): string {
    // Convert markdown to HTML
    return content
      .replace(/#{3}\s+(.+)/g, '<h3>$1</h3>')
      .replace(/#{2}\s+(.+)/g, '<h2>$1</h2>')
      .replace(/#{1}\s+(.+)/g, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  private generateHTMLStyles(options: FormatOptimizationOptions): string {
    return `
      body {
        font-family: ${options.typography.fontFamily};
        font-size: ${options.typography.fontSize}pt;
        line-height: ${options.typography.lineHeight};
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      
      .document-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      
      .document-header {
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .document-header h1 {
        font-size: ${options.typography.headingScale[0]}pt;
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .document-meta {
        display: flex;
        gap: 20px;
        color: #666;
        font-size: 12pt;
      }
      
      .table-of-contents {
        background: #f8f9fa;
        padding: 20px;
        margin-bottom: 30px;
        border-left: 4px solid #007bff;
      }
      
      .document-section {
        margin-bottom: 30px;
      }
      
      .document-section h2 {
        font-size: ${options.typography.headingScale[1]}pt;
        color: #333;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }
      
      .document-footer {
        border-top: 1px solid #ddd;
        padding-top: 20px;
        margin-top: 40px;
        text-align: center;
        color: #666;
        font-size: 10pt;
      }
      
      @media print {
        body { background: white; }
        .document-container { box-shadow: none; }
      }
    `;
  }

  private generateHTMLScripts(): string {
    return `
      // Add search functionality
      function searchDocument(term) {
        // Implementation for document search
      }
      
      // Add interactive features
      document.addEventListener('DOMContentLoaded', function() {
        // Add click handlers for table of contents
        const tocLinks = document.querySelectorAll('.table-of-contents a');
        tocLinks.forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
          });
        });
      });
    `;
  }

  private optimizeHTMLAccessibility(content: string, options: FormatOptimizationOptions): string {
    // Add accessibility features
    return content
      .replace(/<img /g, '<img alt="Chart or diagram" ')
      .replace(/<table>/g, '<table role="table">')
      .replace(/<h([1-6])>/g, '<h$1 tabindex="0">');
  }

  private addHTMLInteractivity(content: string, workProduct: WorkProduct, options: FormatOptimizationOptions): string {
    // Add interactive features like charts and data visualization
    return content; // Placeholder implementation
  }

  private optimizeHTMLResponsive(content: string, options: FormatOptimizationOptions): string {
    // Add responsive design optimizations
    return content; // Placeholder implementation
  }

  private addHTMLSEO(content: string, workProduct: WorkProduct): string {
    // Add SEO optimizations
    return content; // Placeholder implementation
  }

  // Markdown formatting methods
  private formatSectionForMarkdown(section: DocumentSection, options: FormatOptimizationOptions): string {
    const anchor = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `## ${section.title} {#${anchor}}

${section.content}

---

`;
  }

  private optimizeMarkdownSyntax(content: string): string {
    // Optimize markdown syntax for better rendering
    return content
      .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
      .replace(/^[\s]+/gm, '')     // Remove leading whitespace
      .replace(/[\s]+$/gm, '');    // Remove trailing whitespace
  }

  private addMarkdownMetadata(content: string, workProduct: WorkProduct): string {
    // Add YAML frontmatter
    const frontmatter = `---
title: "${workProduct.title}"
date: ${new Date().toISOString().split('T')[0]}
author: DD-Hybrid Platform
sector: ${workProduct.metadata.projectContext?.sector || 'Investment Analysis'}
wordcount: ${workProduct.wordCount || 0}
---

`;
    return frontmatter + content;
  }

  private optimizeMarkdownTables(content: string): string {
    // Optimize table formatting for markdown
    return content; // Placeholder implementation
  }

  private addMarkdownTOC(content: string, workProduct: WorkProduct): string {
    // Add table of contents with proper linking
    return content; // Placeholder implementation
  }

  // Helper methods
  private getExecutivePDFOptions(): FormatOptimizationOptions {
    return {
      typography: { fontFamily: 'Times New Roman', fontSize: 12, lineHeight: 1.5, headingScale: [18, 16, 14, 12, 11] },
      layout: { margins: { top: 1, bottom: 1, left: 1, right: 1 }, pageSize: 'A4', orientation: 'portrait', columns: 1, spacing: { paragraphs: 8, sections: 16, lists: 4 } },
      structure: { includeTableOfContents: true, includeExecutiveSummary: true, includeAppendices: false, sectionNumbering: true, pageNumbers: true, headers: true, footers: true },
      industry: { sector: 'private-equity', complianceLevel: 'enhanced', brandingLevel: 'comprehensive', confidentialityLevel: 'confidential' },
      exportOptions: { quality: 'print', compression: false, allowPrinting: true, allowCopying: false, allowEditing: false }
    };
  }

  private getCollaborativeDOCXOptions(): FormatOptimizationOptions {
    return {
      typography: { fontFamily: 'Calibri', fontSize: 11, lineHeight: 1.4, headingScale: [16, 14, 12, 11, 10] },
      layout: { margins: { top: 1, bottom: 1, left: 1, right: 1 }, pageSize: 'A4', orientation: 'portrait', columns: 1, spacing: { paragraphs: 6, sections: 12, lists: 4 } },
      structure: { includeTableOfContents: false, includeExecutiveSummary: false, includeAppendices: false, sectionNumbering: false, pageNumbers: true, headers: false, footers: false },
      industry: { sector: 'general', complianceLevel: 'standard', brandingLevel: 'minimal', confidentialityLevel: 'internal' },
      exportOptions: { quality: 'standard', compression: true, allowPrinting: true, allowCopying: true, allowEditing: true }
    };
  }

  private getInteractiveHTMLOptions(): FormatOptimizationOptions {
    return {
      typography: { fontFamily: 'Arial, sans-serif', fontSize: 14, lineHeight: 1.6, headingScale: [28, 24, 20, 16, 14] },
      layout: { margins: { top: 0, bottom: 0, left: 0, right: 0 }, pageSize: 'A4', orientation: 'portrait', columns: 1, spacing: { paragraphs: 16, sections: 24, lists: 8 } },
      structure: { includeTableOfContents: true, includeExecutiveSummary: false, includeAppendices: false, sectionNumbering: true, pageNumbers: false, headers: true, footers: true },
      industry: { sector: 'technology', complianceLevel: 'standard', brandingLevel: 'standard', confidentialityLevel: 'internal' },
      exportOptions: { quality: 'high', compression: true, allowPrinting: true, allowCopying: true, allowEditing: false }
    };
  }

  private getTechnicalMarkdownOptions(): FormatOptimizationOptions {
    return {
      typography: { fontFamily: 'Monaco, monospace', fontSize: 12, lineHeight: 1.5, headingScale: [24, 20, 16, 14, 12] },
      layout: { margins: { top: 0, bottom: 0, left: 0, right: 0 }, pageSize: 'A4', orientation: 'portrait', columns: 1, spacing: { paragraphs: 8, sections: 16, lists: 4 } },
      structure: { includeTableOfContents: true, includeExecutiveSummary: false, includeAppendices: true, sectionNumbering: false, pageNumbers: false, headers: false, footers: false },
      industry: { sector: 'technology', complianceLevel: 'standard', brandingLevel: 'minimal', confidentialityLevel: 'internal' },
      exportOptions: { quality: 'standard', compression: false, allowPrinting: true, allowCopying: true, allowEditing: true }
    };
  }

  private estimateFileSize(content: string, format: ExportFormat): number {
    const baseSize = content.length;
    const multipliers = { PDF: 3, DOCX: 2, HTML: 1.2, MARKDOWN: 1 };
    return Math.round(baseSize * (multipliers[format] || 1));
  }

  private estimatePageCount(content: string, options: FormatOptimizationOptions): number {
    const wordsPerPage = 250; // Approximate words per page
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerPage);
  }

  private calculateWordCount(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  private getAppliedOptimizations(format: ExportFormat, options: FormatOptimizationOptions): string[] {
    const optimizations = [`${format} format optimization`];
    
    if (options.structure.includeTableOfContents) optimizations.push('Table of contents');
    if (options.structure.sectionNumbering) optimizations.push('Section numbering');
    if (options.exportOptions.quality === 'print') optimizations.push('Print optimization');
    if (options.industry.complianceLevel === 'enhanced') optimizations.push('Enhanced compliance');
    
    return optimizations;
  }

  private calculateFormatQuality(content: string, format: ExportFormat): number {
    // Calculate quality score based on format-specific criteria
    let score = 0.8; // Base score
    
    if (content.includes('Table of Contents')) score += 0.05;
    if (content.includes('Executive Summary')) score += 0.05;
    if (content.length > 1000) score += 0.05;
    if (format === 'PDF' && content.includes('<<PDF')) score += 0.05;
    
    return Math.min(1.0, score);
  }
}

export const formatOptimizationService = FormatOptimizationService.getInstance();