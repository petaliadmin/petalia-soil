/**
 * User roles in the system
 */
export type UserRole = 'ADMIN' | 'OWNER' | 'FARMER';

/**
 * Owner/User model
 * Represents land owners who can list properties
 */
export interface Owner {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Contact information for display
 */
export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp?: string;
  preferredContact?: 'phone' | 'email' | 'whatsapp';
}


/**
 * Get WhatsApp link with pre-filled message
 */
export function getWhatsAppLink(phone: string, landTitle?: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const message = landTitle
    ? encodeURIComponent(`Bonjour, je suis intéressé(e) par votre terre "${landTitle}" sur Petalia Soil.`)
    : encodeURIComponent('Bonjour, je suis intéressé(e) par votre annonce sur Petalia Soil.');
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
