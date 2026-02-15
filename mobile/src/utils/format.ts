export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatPrice(price: number): string {
  return price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandi',
  PROCESSING: 'Hazirlaniyor',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'Iptal Edildi',
};

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}
