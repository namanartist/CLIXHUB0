import { db } from '../db';
import { Notification } from '../types';
import { pushNotificationService } from './PushNotificationService';
import { authService } from './authService';

export async function createSystemNotification({
  title,
  message,
  type,
  userId,
  link,
}: {
  title: string;
  message: string;
  type: 'Chat' | 'Event' | 'Certificate' | 'Recruitment' | 'Finance' | 'Proposal' | 'General';
  userId?: string;
  link?: string;
}) {
  try {
    const notif: Notification = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type: type as any,
      read: false,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userId,
      link,
    };

    // Save to database
    await db.sendNotification(notif);

    // Browser Native Push Notification - STRICTLY ONLY to the intended recipient
    const currentUser = authService.getUser();
    const isIntendedRecipient = !!(
      userId &&
      currentUser &&
      (currentUser.id === userId || currentUser.email === userId)
    );

    if (isIntendedRecipient && pushNotificationService.isNotificationEnabled()) {
      pushNotificationService.showNotification(title, {
        body: message,
        icon: '/image.png',
        tag: notif.id,
      });
    }

    return notif;
  } catch (e) {
    console.error('Failed to create system notification:', e);
    return null;
  }
}

export async function notifyEventCreated(eventTitle: string, clubName?: string) {
  await createSystemNotification({
    title: '🎉 New Campus Event',
    message: `Event "${eventTitle}" hosted by ${clubName || 'Club'} is now live for registration!`,
    type: 'Event',
    link: '/events',
  });
}

export async function notifyEventApproved(eventTitle: string, clubName?: string) {
  await createSystemNotification({
    title: '✅ Event Approved & Published',
    message: `"${eventTitle}" by ${clubName || 'Club'} has been approved by Faculty Oversight.`,
    type: 'Event',
    link: '/events',
  });
}

export async function notifyEventRegistration(studentName: string, eventTitle: string, ticketId?: string, studentId?: string) {
  await createSystemNotification({
    title: '🎟️ Registration Confirmed',
    message: `${studentName}, your registration for "${eventTitle}" is confirmed! Pass ID: ${ticketId || 'Active Pass'}`,
    type: 'Event',
    userId: studentId,
    link: '/dashboard/tickets',
  });
}

export async function notifyPaymentVerified(studentName: string, eventTitle: string, ticketId?: string, studentId?: string) {
  await createSystemNotification({
    title: '💳 Payment Verified & Pass Issued',
    message: `Payment verified for ${studentName} (${eventTitle}). Ticket pass ${ticketId || ''} is now active.`,
    type: 'Finance',
    userId: studentId,
    link: '/dashboard/tickets',
  });
}

export async function notifyCertificateIssued(studentName: string, eventTitle: string, studentId?: string) {
  await createSystemNotification({
    title: '📜 Verified Certificate Issued',
    message: `Official signed credential issued to ${studentName} for "${eventTitle}".`,
    type: 'Certificate',
    userId: studentId,
    link: '/dashboard/my-certificates',
  });
}

export async function notifyProposalSubmitted(proposalTitle: string, proposerName: string, proposalId?: string) {
  await createSystemNotification({
    title: '🏛️ New Unit Genesis Proposal',
    message: `${proposerName} submitted a new unit blueprint: "${proposalTitle}". Queued for Dean Review.`,
    type: 'Proposal',
    link: '/proposal-workflow',
  });
}

export async function notifyProposalEndorsed(proposalTitle: string, deanName?: string, proposerEmail?: string) {
  await createSystemNotification({
    title: '⭐ Dean Endorsement Granted',
    message: `"${proposalTitle}" was endorsed by Dean Student Welfare (${deanName || 'SW'}). Forwarded to Super Admin.`,
    type: 'Proposal',
    link: '/proposal-workflow',
  });
}

export async function notifyProposalApproved(proposalTitle: string, proposerName?: string) {
  await createSystemNotification({
    title: '🚀 Official Unit Provisioned',
    message: `"${proposalTitle}" is officially established on CLIX Hub with an active site and dashboard!`,
    type: 'Proposal',
    link: '/clubs',
  });
}

export async function notifyProposalRejected(proposalTitle: string, reason?: string, proposerEmail?: string) {
  await createSystemNotification({
    title: '⚠️ Proposal Review Note',
    message: `Proposal "${proposalTitle}" was declined: ${reason || 'Closed during institutional evaluation'}.`,
    type: 'Proposal',
    userId: proposerEmail,
    link: '/proposal-workflow',
  });
}

export async function notifyApplicationSubmitted(candidateName: string, clubName?: string, trackingId?: string) {
  await createSystemNotification({
    title: '📝 New Recruitment Application',
    message: `${candidateName} applied to join ${clubName || 'Club'} [Ref: ${trackingId || 'MITS'}].`,
    type: 'Recruitment',
    link: '/dashboard/recruitment',
  });
}

export async function notifyRecruitmentStatus(candidateName: string, status: string, clubName?: string, studentId?: string) {
  await createSystemNotification({
    title: `📋 Recruitment Update: ${status}`,
    message: `${candidateName}, your application status for ${clubName || 'Club'} is now: ${status}.`,
    type: 'Recruitment',
    userId: studentId,
    link: '/dashboard/recruitment',
  });
}

export async function notifyChatReceived(senderName: string, channelName: string, snippet: string, userId?: string) {
  await createSystemNotification({
    title: `💬 Message from ${senderName}`,
    message: `[${channelName}] ${snippet}`,
    type: 'Chat',
    userId,
    link: '/dashboard/chat',
  });
}
