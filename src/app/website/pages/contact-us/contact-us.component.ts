import { Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {

  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sent = false;
  loading = false;

  submitForm() {

    this.loading = true;

    const templateParams = {
      name: this.form.name,
      email: this.form.email,
      message: this.form.message,
      title: this.form.subject || 'Contact Request'
    };

    emailjs
      .send(
        'service_k1dsae3',        // ✔ your Service ID
        'template_mj0oz63',      // ✔ your Template ID
        templateParams,
        'FLXax255b7VI1MKu0'      // ✔ your Public Key
      )
      .then((res: EmailJSResponseStatus) => {

        console.log('SUCCESS!', res);

        this.loading = false;
        this.sent = true;

        // Reset form
        this.form = { name: '', email: '', subject: '', message: '' };

        // Hide success notification after 3 seconds
        setTimeout(() => (this.sent = false), 3000);
      })
      .catch((error: any) => {

        this.loading = false;
        console.error('FAILED...', error);
        alert('⚠ Something went wrong sending your message.');
      });
  }
}
