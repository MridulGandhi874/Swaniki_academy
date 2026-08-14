import "server-only";

/**
 * Certificates are never stored — a Submission with status "approved" IS the
 * trigger that a student completed a course. The certificateId is a
 * reversible encoding of (uid, courseId), so /verify/[certificateId] can
 * decode it back and re-derive the certificate live from the Submission
 * record (which already exists for evaluation purposes) plus the User/Course
 * docs. Nothing certificate-shaped is ever written to the database.
 */

const PREFIX = "CERT-";
const DELIMITER = "::";

export function encodeCertificateId(uid: string, courseId: string): string {
  const raw = `${uid}${DELIMITER}${courseId}`;
  const encoded = Buffer.from(raw, "utf8").toString("base64url");
  return `${PREFIX}${encoded}`;
}

export function decodeCertificateId(certificateId: string): { uid: string; courseId: string } | null {
  if (!certificateId.startsWith(PREFIX)) return null;

  try {
    const raw = Buffer.from(certificateId.slice(PREFIX.length), "base64url").toString("utf8");
    const idx = raw.indexOf(DELIMITER);
    if (idx === -1) return null;

    const uid = raw.slice(0, idx);
    const courseId = raw.slice(idx + DELIMITER.length);
    if (!uid || !courseId) return null;

    return { uid, courseId };
  } catch {
    return null;
  }
}
