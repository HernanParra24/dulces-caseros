import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketCategory {
  ORDER_ISSUE = 'order_issue',
  PAYMENT_PROBLEM = 'payment_problem',
  TECHNICAL_ISSUE = 'technical_issue',
  PRODUCT_QUESTION = 'product_question',
  ACCOUNT_ISSUE = 'account_issue',
  OTHER = 'other',
}

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketCategory,
  })
  category: TicketCategory;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ length: 255, nullable: true })
  userEmail: string;

  @Column({ length: 100, nullable: true })
  userName: string;

  @Column({ type: 'text', nullable: true })
  adminResponse: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isOpen(): boolean {
    return this.status === TicketStatus.OPEN || this.status === TicketStatus.IN_PROGRESS;
  }

  get isResolved(): boolean {
    return this.status === TicketStatus.RESOLVED || this.status === TicketStatus.CLOSED;
  }
}
