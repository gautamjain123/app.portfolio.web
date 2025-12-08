import { Component } from '@angular/core';
import { Blog, BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
      blogs: Blog[] = [];

  constructor(private blogService: BlogService, private router: Router) {
    this.blogs = this.blogService.getBlogs();
  }

  openPost(slug: string) {
    this.router.navigate(['/blog', slug]);
  }
}
