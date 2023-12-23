import { ReactNode, useState } from 'react';

const SidebarLinkGroup = ({
  children,
  activeCondition,
  onClick, // Tambahkan prop onClick
}) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
    if (onClick) {
      onClick(); // Panggil fungsi onClick jika tersedia
    }
  };

  return <li onClick={handleClick}>{children}</li>; // Ubah cara menampilkan children
};

export default SidebarLinkGroup;
