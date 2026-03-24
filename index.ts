import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export interface TestCardProps {
  title: string;
  subtitle: string;
  price: string;
  status: 'LIVE NOW' | 'UPCOMING' | 'COMPLETED';
  imageUrl: string;
}
