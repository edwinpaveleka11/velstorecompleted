import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
}

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const orders = await getUserOrders(session.user.id);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    totalSpent: orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((acc, o) => acc + Number(o.total), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600 mb-1">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Total</div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(Number(order.total))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product.images[0] && (
                        <div
                          className="w-full h-full bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${item.product.images[0]})` }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
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

              {/* Actions */}
              <div className="border-t mt-4 pt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Payment: <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                </div>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center text-sm"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products" className="btn btn-primary inline-flex">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}