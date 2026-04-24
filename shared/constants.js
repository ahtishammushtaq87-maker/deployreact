export const THEME = {
  primary: '#1c559b', // Deep Indigo
  accent: '#65e5d5',  // Aqua Mint
  background: '#f8fafc',
  text: '#0f172a',
  white: '#ffffff',
};

export const CURRENCIES = {
  PKR: { symbol: 'Rs', name: 'Pakistani Rupee' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
};

export const TRANSACTION_TYPES = {
  TRANSFER: 'Transfer',
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw',
  BILL_PAYMENT: 'BillPayment',
  EXCHANGE: 'Exchange',
};

export const TRANSACTION_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};
