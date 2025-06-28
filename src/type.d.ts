export interface MenuItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  badge?: string;
  isActive?: boolean;
  subItems?: {
    title: string;
    url: string;
    isActive?: boolean;
  }[];
}
