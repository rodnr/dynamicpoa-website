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
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        spaceBetween={50}
        slidesPerView={3}
      >
        <SwiperSlide>
        <img src="/assets/img/clients/logoSugar.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoWalterscheid.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoMartiplast.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/lesaffre.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/ageradora.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoHT4.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/paim.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/factorybeer.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoKlassmatt.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoVIP.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoSuperSan.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoEco.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoOSPA.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoInspire.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoBarcellos.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoLightsource.svg" />
        </SwiperSlide>
        <SwiperSlide>
        <img src="/assets/img/clients/logoOtimizare.svg" />
        </SwiperSlide>
      </Swiper>
    </S.Wrapper>
  );
};

export default Caroussel;
