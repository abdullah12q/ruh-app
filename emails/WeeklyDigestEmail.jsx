import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Preview,
  Font,
} from "react-email";

// Design tokens (email-safe values, no CSS variables)
const COLORS = {
  bg: "#050505",
  surface: "#0f0f0f",
  card: "#111111",
  cardBorder: "rgba(255,255,255,0.07)",
  accent: "#14B8A6",
  accentDim: "rgba(20,184,166,0.15)",
  violet: "#8B5CF6",
  violetDim: "rgba(139,92,246,0.15)",
  textPrimary: "#F3F4F6",
  textSecondary: "#9CA3AF",
  textMuted: "#4B5563",
  amber: "#F59E0B",
  gold: "#FBBF24",
  silver: "#94A3B8",
  bronze: "#A16207",
};

// Rank medal configs
const RANK_MEDALS = [
  { emoji: "🥇", color: COLORS.gold, label: "1st" },
  { emoji: "🥈", color: COLORS.silver, label: "2nd" },
  { emoji: "🥉", color: COLORS.bronze, label: "3rd" },
];

export default function WeeklyDigestEmail({
  recipientName = "Friend",
  halaqah = {
    name: "Elsiefy Family Circle",
    overallPct: 42,
    uniqueAyahsRead: 2619,
    memberCount: 5,
    inviteCode: "ANS7KX",
  },
  leaderboard = [
    { name: "Abdullah", count: 412 },
    { name: "Ahmed", count: 298 },
    { name: "Omar", count: 201 },
  ],
  reflectionPreviews = [
    {
      authorName: "Ahmed",
      surahName: "Al-Baqarah",
      surahNumber: 2,
      ayahNumber: 255,
      content:
        "Ayat al Kursi — the greatest verse. Reading it reminded me of how small our worries are before Allah's infinite throne.",
    },
  ],
  myStats = { count: 201, rank: 3 },
  links = {
    circle: "http://localhost:3000/halaqah",
    unsubscribe: "http://localhost:3000/api/unsubscribe?token=demo",
  },
}) {
  const progressBarWidth = `${Math.min(halaqah.overallPct, 100)}%`;
  const previewText = `Your circle "${halaqah.name}" read ${halaqah.uniqueAyahsRead.toLocaleString()} ayahs this week. See the leaderboard inside.`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>

      <Preview>{previewText}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            {/* Brand line */}
            <Row>
              <Column>
                <Text style={styles.brandName}>Rُuh · رُوح</Text>
                <Text style={styles.brandTagline}>
                  Study Circle · Weekly Digest
                </Text>
              </Column>
            </Row>

            {/* Decorative gradient bar */}
            <div
              style={{
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, #14B8A6, #8B5CF6, transparent)",
                marginTop: "16px",
                borderRadius: "2px",
              }}
            />

            {/* Greeting */}
            <Heading style={styles.greeting}>
              السلام عليكم,{" "}
              <span style={{ color: COLORS.accent }}>{recipientName}</span> 👋
            </Heading>

            <Text style={styles.introCopy}>
              Here&apos;s your weekly update for your Study Circle —{" "}
              <strong style={{ color: COLORS.textPrimary }}>
                {halaqah.name}
              </strong>
              . {halaqah.memberCount} member
              {halaqah.memberCount !== 1 ? "s" : ""} read together this week.
              Keep it up!
            </Text>
          </Section>

          {/* Overall Progress Card */}
          <Section style={styles.card}>
            <Text style={styles.sectionLabel}>📖 GROUP PROGRESS</Text>
            <Row>
              <Column style={{ flex: 1 }}>
                <Heading as="h2" style={styles.bigStat}>
                  {halaqah.overallPct}%
                </Heading>
                <Text style={styles.statCaption}>of the Quran read</Text>
              </Column>
              <Column style={{ flex: 1, textAlign: "right" }}>
                <Heading
                  as="h2"
                  style={{ ...styles.bigStat, color: COLORS.violet }}
                >
                  {halaqah.uniqueAyahsRead.toLocaleString()}
                </Heading>
                <Text style={styles.statCaption}>unique ayahs marked</Text>
              </Column>
            </Row>

            {/* Progress bar */}
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: progressBarWidth,
                }}
              />
            </div>
            <Text style={styles.progressCaption}>
              {6236 - halaqah.uniqueAyahsRead} ayahs remaining until Khatm
            </Text>
          </Section>

          {/* Leaderboard */}
          <Section style={styles.card}>
            <Text style={styles.sectionLabel}>🏆 LEADERBOARD</Text>

            {leaderboard.map((member, i) => {
              const medal = RANK_MEDALS[i];
              const isMe = myStats.rank !== null && myStats.rank === i + 1;
              const barPct =
                leaderboard[0]?.count > 0
                  ? Math.round((member.count / leaderboard[0].count) * 100)
                  : 0;

              return (
                <Row
                  key={i}
                  style={{
                    ...styles.leaderRow,
                    backgroundColor: isMe ? COLORS.accentDim : "transparent",
                    borderLeft: isMe
                      ? `2px solid ${COLORS.accent}`
                      : "2px solid transparent",
                  }}
                >
                  {/* Rank */}
                  <Column style={{ width: "32px" }}>
                    <Text style={{ ...styles.medal, color: medal.color }}>
                      {medal.emoji}
                    </Text>
                  </Column>

                  {/* Name + bar */}
                  <Column style={{ flex: 1, paddingLeft: "8px" }}>
                    <Text
                      style={{
                        ...styles.leaderName,
                        color: isMe ? COLORS.accent : COLORS.textPrimary,
                      }}
                    >
                      {isMe ? `${member.name} (You)` : member.name}
                    </Text>
                    {/* Inline progress bar */}
                    <div style={styles.miniTrack}>
                      <div
                        style={{
                          ...styles.miniFill,
                          width: `${barPct}%`,
                          backgroundColor: isMe ? COLORS.accent : COLORS.violet,
                        }}
                      />
                    </div>
                  </Column>

                  {/* Count */}
                  <Column style={{ width: "60px", textAlign: "right" }}>
                    <Text style={styles.leaderCount}>
                      {member.count.toLocaleString()}
                    </Text>
                    <Text style={styles.leaderCountLabel}>ayahs</Text>
                  </Column>
                </Row>
              );
            })}

            {/* Personal stat if not in top 3 */}
            {myStats.rank !== null && myStats.rank > 3 && (
              <Row
                style={{
                  ...styles.leaderRow,
                  backgroundColor: COLORS.accentDim,
                }}
              >
                <Column style={{ width: "32px" }}>
                  <Text style={{ ...styles.medal, color: COLORS.accent }}>
                    #{myStats.rank}
                  </Text>
                </Column>
                <Column style={{ flex: 1, paddingLeft: "8px" }}>
                  <Text style={{ ...styles.leaderName, color: COLORS.accent }}>
                    You
                  </Text>
                </Column>
                <Column style={{ width: "60px", textAlign: "right" }}>
                  <Text style={styles.leaderCount}>
                    {myStats.count.toLocaleString()}
                  </Text>
                  <Text style={styles.leaderCountLabel}>ayahs</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Recent Reflections */}
          {reflectionPreviews.length > 0 && (
            <Section style={styles.card}>
              <Text style={styles.sectionLabel}>💬 RECENT REFLECTIONS</Text>
              <Text style={styles.sectionSubtitle}>
                Thoughts shared by your circle this week
              </Text>

              {reflectionPreviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.reflectionBubble,
                    marginTop: i > 0 ? "12px" : "0",
                  }}
                >
                  <Row>
                    <Column>
                      <Text style={styles.reflectionMeta}>
                        <span style={{ color: COLORS.accent }}>
                          {r.authorName}
                        </span>
                        &nbsp;on Surah {r.surahNumber}.{" "}
                        <span style={{ color: COLORS.accent }}>
                          {r.surahName}
                        </span>{" "}
                        · Ayah{" "}
                        <span style={{ color: COLORS.accent }}>
                          {r.ayahNumber}
                        </span>
                      </Text>
                      <Text style={styles.reflectionContent}>
                        &ldquo;{r.content}&rdquo;
                      </Text>
                    </Column>
                  </Row>
                </div>
              ))}
            </Section>
          )}

          {/* CTA */}
          <Section style={{ textAlign: "center", padding: "8px 0 24px" }}>
            <Button href={links.circle} style={styles.ctaButton}>
              Open Circle →
            </Button>
            <Text style={styles.ctaSubtext}>
              Invite code:{" "}
              <strong style={{ color: COLORS.accent, letterSpacing: "0.15em" }}>
                {halaqah.inviteCode}
              </strong>
            </Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              You&apos;re receiving this because you&apos;re a member of the{" "}
              <strong>{halaqah.name}</strong> study circle on Rُuh.
            </Text>
            <Text style={styles.footerText}>
              <Link href={links.unsubscribe} style={styles.unsubLink}>
                Unsubscribe from this circle&apos;s weekly digest
              </Link>
            </Text>
            <Text
              style={{
                ...styles.footerText,
                marginTop: "16px",
                fontSize: "10px",
              }}
            >
              Rُuh · رُوح &mdash; Read. Reflect. Remember.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles (email clients don't support external CSS)
const styles = {
  body: {
    backgroundColor: COLORS.bg,
    margin: "0",
    padding: "0",
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 16px 40px",
  },

  // Header
  header: {
    padding: "40px 0 24px",
  },
  brandName: {
    color: COLORS.accent,
    fontSize: "22px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "-0.3px",
  },
  brandTagline: {
    color: COLORS.textMuted,
    fontSize: "11px",
    margin: "2px 0 0",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: "28px",
    fontWeight: "700",
    lineHeight: "1.2",
    margin: "28px 0 12px",
  },
  introCopy: {
    color: COLORS.textSecondary,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 8px",
  },

  // Cards
  card: {
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.cardBorder}`,
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    margin: "0 0 16px",
  },
  sectionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: "13px",
    margin: "-8px 0 16px",
  },

  // Progress
  bigStat: {
    color: COLORS.accent,
    fontSize: "40px",
    fontWeight: "700",
    lineHeight: "1",
    margin: "0 0 4px",
  },
  statCaption: {
    color: COLORS.textSecondary,
    fontSize: "12px",
    margin: "0",
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: "999px",
    height: "8px",
    overflow: "hidden",
    margin: "20px 0 8px",
  },
  progressFill: {
    background: "linear-gradient(90deg, #14B8A6, #8B5CF6)",
    borderRadius: "999px",
    height: "8px",
  },
  progressCaption: {
    color: COLORS.textMuted,
    fontSize: "11px",
    margin: "0",
    textAlign: "right",
  },

  // Leaderboard
  leaderRow: {
    borderRadius: "10px",
    padding: "10px 12px",
    marginBottom: "6px",
    borderLeft: `2px solid transparent`,
  },
  medal: {
    fontSize: "20px",
    margin: "0",
    lineHeight: "1",
  },
  leaderName: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 4px",
  },
  leaderCount: {
    color: COLORS.textPrimary,
    fontSize: "16px",
    fontWeight: "700",
    margin: "0",
    lineHeight: "1",
  },
  leaderCountLabel: {
    color: COLORS.textMuted,
    fontSize: "10px",
    margin: "2px 0 0",
  },
  miniTrack: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: "999px",
    height: "4px",
    overflow: "hidden",
  },
  miniFill: {
    borderRadius: "999px",
    height: "4px",
    minWidth: "4px",
  },

  // Reflections
  reflectionBubble: {
    backgroundColor: COLORS.violetDim,
    border: `1px solid rgba(139,92,246,0.2)`,
    borderRadius: "12px",
    padding: "14px 16px",
    borderLeft: `3px solid ${COLORS.violet}`,
  },
  reflectionMeta: {
    color: COLORS.textSecondary,
    fontSize: "11px",
    margin: "0 0 6px",
  },
  reflectionContent: {
    color: COLORS.textPrimary,
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0",
    fontStyle: "italic",
  },

  // CTA
  ctaButton: {
    backgroundColor: COLORS.accent,
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    padding: "14px 36px",
    borderRadius: "12px",
    textDecoration: "none",
    display: "inline-block",
  },
  ctaSubtext: {
    color: COLORS.textMuted,
    fontSize: "12px",
    marginTop: "14px",
  },

  // Footer
  divider: {
    borderColor: COLORS.cardBorder,
    margin: "8px 0",
  },
  footer: {
    padding: "16px 0 0",
    textAlign: "center",
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 6px",
  },
  unsubLink: {
    color: COLORS.textSecondary,
    textDecoration: "underline",
    fontSize: "12px",
  },
};
