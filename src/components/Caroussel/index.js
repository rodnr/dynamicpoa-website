import React from 'react';

import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

import * as S from './styled';

import {
  EcoAssist,
  EngeSafety,
  Grasiele,
  Lavorolab,
  Martiplast,
  Orella,
  Otimizare,
  Sugarshoes,
  Vigitec
} from '../../svg/ClientsLogos';

SwiperCore.use([Autoplay]);

const Caroussel = () => {
  return (
    <S.Wrapper>
      <Swiper
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={50}
        slidesPerView={3}
      >
        <SwiperSlide>
          <EcoAssist className="w-20 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <EngeSafety className="w-24 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Grasiele className="w-20 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Lavorolab className="w-24 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Martiplast className="w-20 md:w-32 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Orella className="w-24 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Otimizare className="w-20 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Sugarshoes className="w-24 md:w-40 m-auto" />
        </SwiperSlide>
        <SwiperSlide>
          <Vigitec className="w-1/4 lg:w-1/5 m-auto" />
        </SwiperSlide>
      </Swiper>
    </S.Wrapper>
  );
};

export default Caroussel;
