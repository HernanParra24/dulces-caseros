import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ContactStatus {
  NEW = 'new',
  READ = 'read',
  RESPONDED = 'responded',
  CLOSED = 'closed',
}

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100 })
  asunto: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.NEW,
  })
  status: ContactStatus;

  @Column({ type: 'text', nullable: true })
  respuesta: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isNew(): boolean {
    return this.status === ContactStatus.NEW;
  }

  get isRead(): boolean {
    return this.status === ContactStatus.READ || this.status === ContactStatus.RESPONDED;
  }

  get isResponded(): boolean {
    return this.status === ContactStatus.RESPONDED;
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
