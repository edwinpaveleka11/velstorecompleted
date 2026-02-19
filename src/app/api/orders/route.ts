import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, paymentMethod, shippingInfo, notes, subtotal, tax, shipping, total } = body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
        subtotal,
        tax,
        shipping,
        total,
        shippingName: shippingInfo.name,
        shippingEmail: shippingInfo.email,
        shippingPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingZip: shippingInfo.zipCode,
        shippingCountry: 'Indonesia',
        notes: notes || null,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order,
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}