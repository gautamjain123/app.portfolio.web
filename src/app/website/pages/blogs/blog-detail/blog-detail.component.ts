import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Blog, BlogService } from '../blog.service';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
    blog!: Blog | undefined;

  constructor(private route: ActivatedRoute, private blogService: BlogService, private meta: Meta, private title: Title  ) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.blog = this.blogService.getBlogBySlug(slug!);
  }

  setSEO(blog: Blog) {

  // Update browser title dynamically
  this.title.setTitle(`${blog.title} | Gautam Jain`);

  // Clear old meta tags
  this.meta.removeTag("name='description'");
  this.meta.removeTag("property='og:title'");
  this.meta.removeTag("property='og:description'");
  this.meta.removeTag("property='og:image'");
  this.meta.removeTag("property='og:url'");
  this.meta.removeTag("name='twitter:title'");
  this.meta.removeTag("name='twitter:description'");
  this.meta.removeTag("name='twitter:image'");

  // Add fresh meta tags
  this.meta.addTags([
    {
      name: 'description',
      content: blog.excerpt
    },
    {
      property: 'og:title',
      content: blog.title
    },
    {
      property: 'og:description',
      content: blog.excerpt
    },
    {
      property: 'og:image',
      content: blog.cover
    },
    {
      property: 'og:url',
      content: `https://yourwebsite.com/blog/${blog.slug}`
    },
    {
      name: 'twitter:title',
      content: blog.title
    },
    {
      name: 'twitter:description',
      content: blog.excerpt
    },
    {
      name: 'twitter:image',
      content: blog.cover
    }
  ]);
}

}
