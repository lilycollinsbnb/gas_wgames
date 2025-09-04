import ImageWithFallback from "../ui/image-with-fallback";

export const TrainingIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
            <ImageWithFallback
              src="/images/training.png"
              alt="Trainings"
              width={32}
              height={32}
            />
  );
}
