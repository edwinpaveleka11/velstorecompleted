'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { 
  CreditCard, 
  Building2, 
  Smartphone,
  Wallet,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/components/ToastNotification';

// Define payment option types
interface BankTransferOption {
  id: string;
  name: string;
  fullName: string;
  accountNumber: string;
  accountName: string;
  instructions: string[];
  logo: string;
}

interface EWalletOption {
  id: string;
  name: string;
  fullName: string;
  instructions: string[];
  logo: string;
  qrCode: boolean;
  phoneNumber?: string;
  universal?: boolean;
}

interface VirtualAccountOption {
  id: string;
  name: string;
  fullName: string;
  vaNumber: string;
  vaFormat: string;
  expiry: string;
  instructions: string[];
  logo: string;
}

interface CreditCardOption {
  id: string;
  name: string;
  fullName: string;
  secure3d: boolean;
  instructions: string[];
  logo: string;
}

interface CODOption {
  id: string;
  name: string;
  fullName: string;
  instructions: string[];
  notes?: string[];
}

interface InstallmentOption {
  id: string;
  name: string;
  fullName: string;
  tenors: string[];
  minTransaction: number;
  instructions: string[];
  logo: string;
}

type PaymentOption = BankTransferOption | EWalletOption | VirtualAccountOption | CreditCardOption | CODOption | InstallmentOption;

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any;
  popular: boolean;
  processingTime: string;
  fee: string;
  maxAmount?: number;
  minAmount?: number;
  options: PaymentOption[];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [session, items, router]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.11;
  const shipping = subtotal >= 500000 ? 0 : 50000;
  const total = subtotal + tax + shipping;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer via ATM, Mobile Banking, atau Internet Banking',
      icon: Building2,
      popular: true,
      processingTime: 'Verifikasi 1-15 menit',
      fee: 'Gratis',
      options: [
        {
          id: 'bca',
          name: 'BCA',
          fullName: 'Bank Central Asia',
          accountNumber: '5480-123-456',
          accountName: 'PT Velstore',
          instructions: [
            'Login ke BCA Mobile atau KlikBCA',
            'Pilih menu Transfer',
            'Masukkan nomor rekening tujuan',
            'Masukkan jumlah transfer sesuai total',
            'Konfirmasi dan simpan bukti transfer',
          ],
          logo: '/payment/bca.png',
        },
        {
          id: 'mandiri',
          name: 'Mandiri',
          fullName: 'Bank Mandiri',
          accountNumber: '1370-123-456-789',
          accountName: 'PT Velstore',
          instructions: [
            'Login ke Livin by Mandiri',
            'Pilih Transfer > Antar Bank Mandiri',
            'Input nomor rekening tujuan',
            'Input nominal sesuai total',
            'Konfirmasi transaksi',
          ],
          logo: '/payment/mandiri.png',
        },
        {
          id: 'bri',
          name: 'BRI',
          fullName: 'Bank Rakyat Indonesia',
          accountNumber: '0123-01-123456-50-9',
          accountName: 'PT Velstore',
          instructions: [
            'Login ke BRI Mobile',
            'Pilih Transfer',
            'Pilih Sesama BRI',
            'Masukkan rekening tujuan',
            'Input nominal dan konfirmasi',
          ],
          logo: '/payment/bri.png',
        },
        {
          id: 'bni',
          name: 'BNI',
          fullName: 'Bank Negara Indonesia',
          accountNumber: '0123456789',
          accountName: 'PT Velstore',
          instructions: [
            'Login ke BNI Mobile Banking',
            'Pilih Transfer',
            'Pilih ke Rekening BNI',
            'Input data transfer',
            'Verifikasi dan selesaikan',
          ],
          logo: '/payment/bni.png',
        },
      ],
    },
    {
      id: 'ewallet',
      name: 'E-Wallet / QRIS',
      description: 'Bayar praktis dengan dompet digital',
      icon: Smartphone,
      popular: true,
      processingTime: 'Instant',
      fee: 'Gratis',
      options: [
        {
          id: 'gopay',
          name: 'GoPay',
          fullName: 'GoPay by Gojek',
          instructions: [
            'Buka aplikasi Gojek',
            'Pilih GoPay',
            'Scan QR Code yang ditampilkan',
            'Atau input nomor Virtual Account',
            'Konfirmasi pembayaran',
          ],
          logo: '/payment/gopay.png',
          qrCode: true,
          phoneNumber: '0812-3456-7890',
        },
        {
          id: 'ovo',
          name: 'OVO',
          fullName: 'OVO Cash',
          instructions: [
            'Buka aplikasi OVO',
            'Pilih Pay/Transfer',
            'Scan QR Code',
            'Atau pilih Transfer ke nomor',
            'Input PIN dan konfirmasi',
          ],
          logo: '/payment/ovo.png',
          qrCode: true,
          phoneNumber: '0812-3456-7890',
        },
        {
          id: 'dana',
          name: 'DANA',
          fullName: 'DANA Digital Wallet',
          instructions: [
            'Buka aplikasi DANA',
            'Pilih Scan untuk bayar',
            'Scan QR Code yang ditampilkan',
            'Atau pilih Send Money',
            'Konfirmasi dengan PIN',
          ],
          logo: '/payment/dana.png',
          qrCode: true,
          phoneNumber: '0812-3456-7890',
        },
        {
          id: 'shopeepay',
          name: 'ShopeePay',
          fullName: 'ShopeePay',
          instructions: [
            'Buka aplikasi Shopee',
            'Pilih ShopeePay',
            'Scan QR Code',
            'Atau pilih Transfer',
            'Konfirmasi pembayaran',
          ],
          logo: '/payment/shopeepay.png',
          qrCode: true,
          phoneNumber: '0812-3456-7890',
        },
        {
          id: 'qris',
          name: 'QRIS',
          fullName: 'Quick Response Code Indonesian Standard',
          instructions: [
            'Buka aplikasi e-wallet/m-banking',
            'Pilih menu Scan QR',
            'Scan QRIS yang ditampilkan',
            'Nominal otomatis terisi',
            'Konfirmasi pembayaran',
          ],
          logo: '/payment/qris.png',
          qrCode: true,
          universal: true,
        },
      ],
    },
    {
      id: 'virtual_account',
      name: 'Virtual Account',
      description: 'Bayar melalui nomor VA unik',
      icon: Wallet,
      popular: false,
      processingTime: 'Verifikasi 5-10 menit',
      fee: 'Rp 4.000',
      options: [
        {
          id: 'bca_va',
          name: 'BCA Virtual Account',
          fullName: 'BCA Virtual Account',
          vaNumber: '12345 xxxx xxxx xxxx',
          vaFormat: 'VA akan digenerate setelah checkout',
          expiry: '24 jam',
          instructions: [
            'Pilih Transfer di ATM/M-Banking BCA',
            'Pilih Virtual Account Billing',
            'Input nomor VA yang diberikan',
            'Input jumlah yang harus dibayar',
            'Konfirmasi transaksi',
          ],
          logo: '/payment/bca.png',
        },
        {
          id: 'mandiri_va',
          name: 'Mandiri Virtual Account',
          fullName: 'Mandiri Virtual Account',
          vaNumber: '88012 xxxx xxxx xxxx',
          vaFormat: 'VA akan digenerate setelah checkout',
          expiry: '24 jam',
          instructions: [
            'Pilih Bayar/Beli di ATM Mandiri',
            'Pilih Lainnya',
            'Pilih Multi Payment',
            'Input kode perusahaan: 88012',
            'Input nomor VA dan konfirmasi',
          ],
          logo: '/payment/mandiri.png',
        },
        {
          id: 'bri_va',
          name: 'BRI Virtual Account',
          fullName: 'BRI Virtual Account',
          vaNumber: 'xxxx xxxx xxxx xxxx',
          vaFormat: 'VA akan digenerate setelah checkout',
          expiry: '24 jam',
          instructions: [
            'Login BRI Mobile',
            'Pilih Pembayaran',
            'Pilih BRIVA',
            'Input nomor Virtual Account',
            'Input nominal dan konfirmasi',
          ],
          logo: '/payment/bri.png',
        },
        {
          id: 'bni_va',
          name: 'BNI Virtual Account',
          fullName: 'BNI Virtual Account',
          vaNumber: '8808 xxxx xxxx xxxx',
          vaFormat: 'VA akan digenerate setelah checkout',
          expiry: '24 jam',
          instructions: [
            'Login BNI Mobile Banking',
            'Pilih Transfer',
            'Pilih Virtual Account Billing',
            'Input nomor VA',
            'Verifikasi dan bayar',
          ],
          logo: '/payment/bni.png',
        },
        {
          id: 'permata_va',
          name: 'Permata Virtual Account',
          fullName: 'Permata Virtual Account',
          vaNumber: 'xxxx xxxx xxxx xxxx',
          vaFormat: 'VA akan digenerate setelah checkout',
          expiry: '24 jam',
          instructions: [
            'Login PermataMobile X',
            'Pilih Pembayaran Tagihan',
            'Pilih Virtual Account',
            'Input nomor VA',
            'Konfirmasi pembayaran',
          ],
          logo: '/payment/permata.png',
        },
      ],
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit/Debit',
      description: 'Bayar dengan kartu kredit atau debit',
      icon: CreditCard,
      popular: false,
      processingTime: 'Instant',
      fee: 'Gratis (atau sesuai bank)',
      options: [
        {
          id: 'visa',
          name: 'Visa',
          fullName: 'Visa Credit/Debit Card',
          secure3d: true,
          instructions: [
            'Masukkan nomor kartu 16 digit',
            'Input masa berlaku (MM/YY)',
            'Input CVV (3 digit di belakang)',
            'Verifikasi dengan OTP',
            'Pembayaran selesai',
          ],
          logo: '/payment/visa.png',
        },
        {
          id: 'mastercard',
          name: 'Mastercard',
          fullName: 'Mastercard Credit/Debit',
          secure3d: true,
          instructions: [
            'Input data kartu Mastercard',
            'Masukkan CVV',
            'Verifikasi dengan 3D Secure',
            'Input OTP dari SMS',
            'Transaksi berhasil',
          ],
          logo: '/payment/mastercard.png',
        },
        {
          id: 'jcb',
          name: 'JCB',
          fullName: 'JCB Card',
          secure3d: true,
          instructions: [
            'Input nomor kartu JCB',
            'Masukkan tanggal kadaluarsa',
            'Input CVV',
            'Verifikasi OTP',
            'Selesai',
          ],
          logo: '/payment/jcb.png',
        },
        {
          id: 'amex',
          name: 'American Express',
          fullName: 'American Express Card',
          secure3d: true,
          instructions: [
            'Masukkan nomor kartu AMEX',
            'Input CID (4 digit)',
            'Verifikasi dengan SafeKey',
            'Konfirmasi pembayaran',
          ],
          logo: '/payment/amex.png',
        },
      ],
    },
    {
      id: 'cod',
      name: 'Bayar di Tempat (COD)',
      description: 'Bayar tunai saat barang sampai',
      icon: Wallet,
      popular: false,
      processingTime: 'Saat pengiriman',
      fee: 'Rp 10.000',
      maxAmount: 5000000,
      options: [
        {
          id: 'cod_cash',
          name: 'Cash on Delivery',
          fullName: 'Bayar Ditempat (COD)',
          instructions: [
            'Siapkan uang tunai pas',
            'Total: Harga barang + Ongkir + Biaya COD',
            'Cek kondisi barang',
            'Bayar ke kurir',
            'Simpan struk pembayaran',
          ],
          notes: [
            '⚠️ Maksimal transaksi: Rp 5.000.000',
            '⚠️ Biaya layanan COD: Rp 10.000',
            '⚠️ Hanya tersedia untuk area tertentu',
            '✓ Cek barang sebelum bayar',
          ],
        },
      ],
    },
    {
      id: 'installment',
      name: 'Cicilan 0%',
      description: 'Cicilan kartu kredit 3-12 bulan',
      icon: CreditCard,
      popular: false,
      processingTime: 'Instant',
      fee: 'Bervariasi per bank',
      minAmount: 1000000,
      options: [
        {
          id: 'installment_bca',
          name: 'BCA Cicilan 0%',
          fullName: 'BCA Credit Card Installment',
          tenors: ['3 bulan', '6 bulan', '12 bulan'],
          minTransaction: 1000000,
          instructions: [
            'Pilih tenor cicilan (3/6/12 bulan)',
            'Input data kartu kredit BCA',
            'Verifikasi dengan OTP',
            'Cicilan disetujui',
            'Pembayaran pertama bulan depan',
          ],
          logo: '/payment/bca.png',
        },
        {
          id: 'installment_mandiri',
          name: 'Mandiri Cicilan 0%',
          fullName: 'Mandiri Credit Card Installment',
          tenors: ['3 bulan', '6 bulan', '12 bulan'],
          minTransaction: 1000000,
          instructions: [
            'Pilih tenor dan bank',
            'Input kartu kredit Mandiri',
            'Verifikasi pembayaran',
            'Cicilan otomatis terpotong',
          ],
          logo: '/payment/mandiri.png',
        },
      ],
    },
  ];

  // Type guard functions
  const isBankTransfer = (option: PaymentOption): option is BankTransferOption => {
    return 'accountNumber' in option;
  };

  const isVirtualAccount = (option: PaymentOption): option is VirtualAccountOption => {
    return 'vaNumber' in option;
  };

  const isInstallment = (option: PaymentOption): option is InstallmentOption => {
    return 'tenors' in option;
  };

  const isCOD = (option: PaymentOption): option is CODOption => {
    return 'notes' in option;
  };

  const handlePaymentSelect = (categoryId: string, optionId: string) => {
    setSelectedPaymentCategory(categoryId);
    setSelectedPaymentOption(optionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaymentCategory || !selectedPaymentOption) {
      showToast('Please select a payment method', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod: `${selectedPaymentCategory}:${selectedPaymentOption}`,
        shippingInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        notes: formData.notes,
        subtotal,
        tax,
        shipping,
        total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const data = await res.json();

      clearCart();

      router.push(`/checkout/success?orderId=${data.order.id}&payment=${selectedPaymentCategory}:${selectedPaymentOption}`);
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Failed to process order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-7xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="input"
                      placeholder="+62 812-3456-7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="input"
                      placeholder="Street address, apartment, etc."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="input"
                      placeholder="Special instructions for delivery..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const isExpanded = expandedCategory === method.id;
                    const isSelected = selectedPaymentCategory === method.id;
                    
                    return (
                      <div key={method.id} className="border-2 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : method.id)}
                          className={`w-full flex items-center justify-between p-4 transition-colors ${
                            isSelected
                              ? 'bg-primary-50 border-primary-600'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <method.icon className="w-6 h-6 text-gray-600" />
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{method.name}</span>
                                {method.popular && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{method.description}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>⚡ {method.processingTime}</span>
                                <span>💰 {method.fee}</span>
                              </div>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="p-4 bg-gray-50 border-t space-y-3">
                            {method.options.map((option) => (
                              <label
                                key={option.id}
                                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                  selectedPaymentOption === option.id && isSelected
                                    ? 'border-primary-600 bg-white'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="radio"
                                    name="paymentOption"
                                    checked={selectedPaymentOption === option.id && isSelected}
                                    onChange={() => handlePaymentSelect(method.id, option.id)}
                                    className="mt-1 w-4 h-4 text-primary-600"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 mb-1">
                                      {option.name}
                                    </div>
                                    {isBankTransfer(option) && (
                                      <div className="text-sm text-gray-600 mb-2">
                                        <div>No. Rek: <span className="font-mono font-medium">{option.accountNumber}</span></div>
                                        <div>a.n. {option.accountName}</div>
                                      </div>
                                    )}
                                    {isVirtualAccount(option) && (
                                      <div className="text-sm text-gray-600 mb-2">
                                        <div>{option.vaFormat}</div>
                                        <div className="text-xs text-orange-600 mt-1">⏱️ Berlaku: {option.expiry}</div>
                                      </div>
                                    )}
                                    {isInstallment(option) && (
                                      <div className="text-sm text-gray-600 mb-2">
                                        <div>Tenor: {option.tenors.join(', ')}</div>
                                        <div className="text-xs">Min. transaksi: {formatPrice(option.minTransaction)}</div>
                                      </div>
                                    )}
                                    <details className="mt-2">
                                      <summary className="text-sm text-primary-600 cursor-pointer hover:text-primary-700">
                                        Lihat cara pembayaran
                                      </summary>
                                      <ol className="mt-2 text-sm text-gray-600 space-y-1 pl-4">
                                        {option.instructions.map((instruction, idx) => (
                                          <li key={idx} className="list-decimal">{instruction}</li>
                                        ))}
                                      </ol>
                                      {isCOD(option) && option.notes && (
                                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs space-y-1">
                                          {option.notes.map((note, idx) => (
                                            <div key={idx}>{note}</div>
                                          ))}
                                        </div>
                                      )}
                                    </details>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>PPN (11%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !selectedPaymentOption}
                  className="w-full btn btn-primary mt-6 flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}