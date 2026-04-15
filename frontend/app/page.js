import Hero        from '@/components/home/Hero';
import ProblemSolution from '@/components/home/ProblemSolution';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Benefits     from '@/components/home/Benefits';
import Testimonials from '@/components/home/Testimonials';
import BottomCTA    from '@/components/home/BottomCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <FeaturedProducts />
      <Benefits />
      <Testimonials />
      <BottomCTA />
    </>
  );
}
