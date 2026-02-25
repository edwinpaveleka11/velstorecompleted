'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  Package, 
  ArrowRight, 
  Home, 
  Copy,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ToastNotification';

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orderId = searchParams.get('orderId');
  const paymentParam = searchParams.get('payment');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order:', error);
        setIsLoading(false);
      });
  }, [orderId, router]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getPaymentDetails = () => {
    if (!paymentParam) return null;
    
    const [category, option] = paymentParam.split(':');
    
    const paymentDetails: { [key: string]: any } = {
      'bank_transfer:bca': {
        name: 'Bank Transfer BCA',
        accountNumber: '5480-123-456',
        accountName: 'PT LuxeShop Indonesia',
        bank: 'BCA (Bank Central Asia)',
        instructions: [
          'Login ke BCA Mobile atau KlikBCA',
          'Pilih menu Transfer',
          'Masukkan nomor rekening: 5480-123-456',
          'Masukkan nominal: ' + formatPrice(order?.total || 0),
          'a.n. PT LuxeShop Indonesia',
          'Konfirmasi dan simpan bukti transfer',
          'Upload bukti transfer ke halaman order',
        ],
        expiry: '24 jam',
      },
      'bank_transfer:mandiri': {
        name: 'Bank Transfer Mandiri',
        accountNumber: '1370-123-456-789',
        accountName: 'PT LuxeShop Indonesia',
        bank: 'Bank Mandiri',
        instructions: [
          'Login ke Livin by Mandiri',
          'Pilih Transfer > Antar Bank Mandiri',
          'Input nomor rekening: 1370-123-456-789',
          'Input nominal: ' + formatPrice(order?.total || 0),
          'a.n. PT LuxeShop Indonesia',
          'Konfirmasi transaksi',
          'Simpan bukti transfer',
        ],
        expiry: '24 jam',
      },
      'bank_transfer:bri': {
        name: 'Bank Transfer BRI',
        accountNumber: '0123-01-123456-50-9',
        accountName: 'PT LuxeShop Indonesia',
        bank: 'BRI (Bank Rakyat Indonesia)',
        instructions: [
          'Login ke BRI Mobile',
          'Pilih Transfer > Sesama BRI',
          'Input rekening: 0123-01-123456-50-9',
          'Input nominal: ' + formatPrice(order?.total || 0),
          'Konfirmasi pembayaran',
        ],
        expiry: '24 jam',
      },
      'bank_transfer:bni': {
        name: 'Bank Transfer BNI',
        accountNumber: '0123456789',
        accountName: 'PT LuxeShop Indonesia',
        bank: 'BNI (Bank Negara Indonesia)',
        instructions: [
          'Login ke BNI Mobile Banking',
          'Pilih Transfer > ke Rekening BNI',
          'Input nomor rekening: 0123456789',
          'Input nominal: ' + formatPrice(order?.total || 0),
          'Verifikasi dan selesaikan',
        ],
        expiry: '24 jam',
      },
      'ewallet:gopay': {
        name: 'GoPay',
        instructions: [
          'Buka aplikasi Gojek',
          'Pilih GoPay',
          'Scan QR Code yang dikirim ke email',
          'Atau transfer ke nomor: 0812-3456-7890',
          'a.n. LuxeShop',
          'Nominal: ' + formatPrice(order?.total || 0),
          'Konfirmasi pembayaran',
        ],
        qrCode: true,
        phoneNumber: '0812-3456-7890',
        expiry: '1 jam',
      },
      'ewallet:ovo': {
        name: 'OVO',
        instructions: [
          'Buka aplikasi OVO',
          'Pilih Transfer',
          'Transfer ke: 0812-3456-7890',
          'a.n. LuxeShop',
          'Nominal: ' + formatPrice(order?.total || 0),
          'Input PIN dan konfirmasi',
        ],
        phoneNumber: '0812-3456-7890',
        expiry: '1 jam',
      },
      'ewallet:dana': {
        name: 'DANA',
        instructions: [
          'Buka aplikasi DANA',
          'Pilih Send Money',
          'Input nomor: 0812-3456-7890',
          'Nominal: ' + formatPrice(order?.total || 0),
          'Konfirmasi dengan PIN',
        ],
        phoneNumber: '0812-3456-7890',
        expiry: '1 jam',
      },
      'ewallet:shopeepay': {
        name: 'ShopeePay',
        instructions: [
          'Buka aplikasi Shopee',
          'Pilih ShopeePay',
          'Scan QR Code dari email',
          'Atau transfer ke: 0812-3456-7890',
          'Konfirmasi pembayaran',
        ],
        qrCode: true,
        phoneNumber: '0812-3456-7890',
        expiry: '1 jam',
      },
      'ewallet:qris': {
        name: 'QRIS',
        instructions: [
          'Buka aplikasi e-wallet/m-banking',
          'Pilih Scan QR',
          'Scan QRIS dari email',
          'Nominal otomatis terisi',
          'Konfirmasi pembayaran',
        ],
        qrCode: true,
        universal: true,
        expiry: '30 menit',
      },
      'virtual_account:bca_va': {
        name: 'BCA Virtual Account',
        vaNumber: order?.orderNumber?.replace('ORD-', '12345') || '12345000000000',
        instructions: [
          'Login ke BCA Mobile atau ATM BCA',
          'Pilih Transfer > Virtual Account',
          'Input nomor VA: ' + (order?.orderNumber?.replace('ORD-', '12345') || '12345000000000'),
          'Nominal otomatis terisi: ' + formatPrice(order?.total || 0),
          'Konfirmasi transaksi',
        ],
        expiry: '24 jam',
      },
      'virtual_account:mandiri_va': {
        name: 'Mandiri Virtual Account',
        vaNumber: order?.orderNumber?.replace('ORD-', '88012') || '88012000000000',
        instructions: [
          'Ke ATM Mandiri',
          'Pilih Bayar/Beli > Multi Payment',
          'Input kode: 88012',
          'Input VA: ' + (order?.orderNumber?.replace('ORD-', '88012') || '88012000000000'),
          'Konfirmasi pembayaran',
        ],
        expiry: '24 jam',
      },
      'credit_card:visa': {
        name: 'Visa Card',
        instructions: [
          'Pembayaran kartu akan diproses otomatis',
          'Cek email untuk konfirmasi',
          'Jika gagal, ulangi pembayaran',
        ],
        instant: true,
      },
      'credit_card:mastercard': {
        name: 'Mastercard',
        instructions: [
          'Pembayaran kartu akan diproses otomatis',
          'Verifikasi 3D Secure telah selesai',
          'Tunggu konfirmasi pembayaran',
        ],
        instant: true,
      },
      'cod:cod_cash': {
        name: 'Cash on Delivery',
        instructions: [
          'Siapkan uang tunai pas',
          'Total yang harus dibayar: ' + formatPrice((order?.total || 0) + 10000),
          '(Harga barang + Biaya COD Rp 10.000)',
          'Cek kondisi barang saat diterima',
          'Bayar langsung ke kurir',
          'Simpan struk pembayaran',
        ],
        codFee: 10000,
        notes: [
          'Bayar saat barang sampai',
          'Biaya COD: Rp 10.000',
          'Cek barang sebelum bayar',
        ],
      },
    };

    return paymentDetails[paymentParam] || null;
  };

  const paymentInfo = getPaymentDetails();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link href="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Payment Instructions */}
        {paymentInfo && !paymentInfo.instant && (
          <div className="card p-6 mb-6 border-2 border-primary-200 bg-primary-50">
            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Complete Your Payment
                </h2>
                <p className="text-sm text-gray-600">
                  Please complete payment within <strong className="text-orange-600">{paymentInfo.expiry}</strong>
                </p>
              </div>
            </div>

            {(paymentInfo.accountNumber || paymentInfo.vaNumber || paymentInfo.phoneNumber) && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">{paymentInfo.name}</h3>
                
                {paymentInfo.bank && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Bank</p>
                    <p className="font-medium text-gray-900">{paymentInfo.bank}</p>
                  </div>
                )}

                {paymentInfo.accountNumber && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Account Number</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                        {paymentInfo.accountNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentInfo.accountNumber, 'account')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {paymentInfo.vaNumber && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Virtual Account Number</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                        {paymentInfo.vaNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentInfo.vaNumber, 'va')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === 'va' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {paymentInfo.phoneNumber && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded">
                        {paymentInfo.phoneNumber}
                      </code>
                      <button
                        onClick={() => handleCopy(paymentInfo.phoneNumber, 'phone')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedField === 'phone' ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {paymentInfo.accountName && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Account Name</p>
                    <p className="font-medium text-gray-900">{paymentInfo.accountName}</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-2xl font-bold text-primary-600 bg-gray-100 px-3 py-2 rounded">
                      {formatPrice(Number(order.total) + (paymentInfo.codFee || 0))}
                    </code>
                    <button
                      onClick={() => handleCopy(String(Number(order.total) + (paymentInfo.codFee || 0)), 'amount')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedField === 'amount' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  {paymentInfo.codFee && (
                    <p className="text-xs text-gray-500 mt-1">
                      Include biaya COD: {formatPrice(paymentInfo.codFee)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Cara Pembayaran:</h4>
              <ol className="space-y-2">
                {paymentInfo.instructions.map((instruction: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>

              {paymentInfo.notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  {paymentInfo.notes.map((note: string, idx: number) => (
                    <p key={idx} className="text-sm text-gray-700">{note}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 text-sm text-orange-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Jika pembayaran tidak selesai dalam {paymentInfo.expiry}, pesanan akan otomatis dibatalkan.
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="card p-8 mb-6">
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900">
                  {paymentInfo?.name || order.paymentMethod.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="font-semibold text-primary-600 text-lg">
                  {formatPrice(Number(order.total))}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-b pb-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingPhone}</p>
              <p>{order.shippingEmail}</p>
              <p className="pt-2">
                {order.shippingAddress}<br />
                {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                {order.shippingCountry}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images[0] && (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.product.images[0]})` }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × {formatPrice(Number(item.price))}
                    </p>
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatPrice(Number(item.total))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account/orders"
            className="flex-1 btn btn-primary flex items-center justify-center"
          >
            <Package className="w-5 h-5 mr-2" />
            View My Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 btn btn-outline flex items-center justify-center"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}