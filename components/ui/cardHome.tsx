interface CardHomeProps {
  texto: string;
  link:string;
onClick?: () => void;
title?: string;
image?: string;
}

export function CardHome({ texto, link, onClick, title, image }: CardHomeProps) {
  return (

    <a href={link} onClick={onClick} className="bg-gray-200 m-2 shadow-md rounded-lg p-3 flex flex-col h-48 w-48 items-center ">
        {image && <img src={image} alt="Card Image" className="w-full h-32 object-cover rounded-md" />}
        <p className="text-lg font-semibold text-gray-800">{texto}</p>
        
    </a>
    
  );
}
