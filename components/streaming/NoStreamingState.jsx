export default function NoStreamingState({ Icon, title, subTitle }) {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center size-20 rounded-full glass mb-6">
        <Icon size={32} className="text-text-secondary" />
      </div>
      <h2 className="font-jakarta font-bold text-xl text-text-primary mb-2">
        No {title} Available
      </h2>
      <p className="text-text-secondary font-inter">
        Could not load {subTitle.toLowerCase()}. Please try again later.
      </p>
    </div>
  );
}
