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
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        spaceBetween={250}
        slidesPerView={4}
      >
        <SwiperSlide>
        <img src="/assets/img/clients/1.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/2.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/3.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/4.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/5.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/6.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/7.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/8.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/9.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/10.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/11.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/12.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/13.png" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/14.png" />
        </SwiperSlide>
      </Swiper>
    </S.Wrapper>
  );
};

export default Caroussel;
