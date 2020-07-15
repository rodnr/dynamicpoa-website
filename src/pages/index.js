import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import SEO from '../components/seo';

import Button from '../components/Button';
import CustomerCard from '../components/CustomerCard';
import LabelText from '../components/LabelText';
import Layout from '../components/layout/Layout';
import SplitSection from '../components/SplitSection';
import LogoSection from '../components/LogoSection';
import customerData from '../data/customer-data';
import LottieWork from '../components/LottieWork';
import DynamicIcon from '../svg/DynamicIcon';
import { Excel, PowerBI } from '../svg/SvgSheets';

import SolucoesSection from '../components/SolucoesSection';

export default () => (
  <Layout>
    <SEO
      title="Home"
      description="Desenvolvimento, Consultoria e Treinamento nas ferramentas da Microsoft. Conheça nossas soluções!"
    />
    <section className="pt-20" id="top">
      <div className="container mx-auto px-8 lg:flex items-center">
        <div className="text-center lg:w-1/2">
          <div className="w-1/5 mb-8 mx-auto">
            <DynamicIcon className="" />
          </div>
          <p className="text-xl lg:text-2xl mt-6 font-light">
            Soluções em Microsoft 365 e Plataforma Power.
          </p>
          <p className="mt-8 md:mt-12">
            <Button>
              <AnchorLink className="text-white hover:text-white" href="#solucoes">
                Conheça as soluções
              </AnchorLink>
            </Button>
          </p>
        </div>
        <div className="m-0 hidden lg:w-1/2 lg:block">
          <LottieWork />
        </div>
      </div>
    </section>
    <SolucoesSection />
    <SplitSection
      id="ferramentas"
      primarySlot={
        <div className="lg:pr-32 xl:pr-48 border-l-2 pl-8 border-primary">
          <h3 className="text-3xl font-light leading-tight mb-6">MICROSOFT 365</h3>
          <p className="text-gray-700 mb-4">
            Planilhas, apresentações, dashboards, fórmularios, etc.
            Substitua as tarefas repetitivas e manuais na sua empresa por processos automatizados.
          </p>
          <svg overflow="hidden" viewBox="0 0 467 119">
            <defs>
              <clipPath id="officePrefix__a">
                <path d="M91 303h467v119H91z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__b">
                <path d="M0 0h106v106H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__d">
                <path d="M220 314h92v92h-92z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__f">
                <path d="M0 0h98v96H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__h">
                <path d="M0 0h83.674v82H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__j">
                <path d="M0 0h121v120H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__l">
                <path d="M0 0h106v106H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="officePrefix__n">
                <path d="M91 307h106v106H91z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <image
                id="officePrefix__c"
                width={106}
                height={106}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAABqCAMAAABj/zSlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE1UExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALB7Sf8AAABndFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWaTGykTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAHZklEQVRoQ+2aZ1fqSheADz1A6EWaiLQDiIo0adKkidTQA4RQcv//T7gzEMrxcDwQje+77vL5YiXP2nt2Ziaz8+Obb775P4Gzh/4NC4CLc7lcHn8Lj8flsiGEGj5fKELEEimKylBUKhEjIqGAzwM6+n8+BQ4IRohIUIVKqzcYTWaL2Wwy6LVqhUyCCD/RBgICHlShuTBf2d3em7v7QCBwf+f3uh1X5guNEhUL+SCV9H9/ACgSSeQao9Xpuw/Hkuncc7FUKhUL+UwqFg74XDaTViFFBCA0+hNMgSJUqb90+kPxTKFSa7Y7vT6k18WatZdiNhG+dVsNahTIPpRGKJKqDDbPQzxbrrd7Q3xCEDNyzYyY4MMe1qjkE0HftRHI+B8IjMMTSpQXNl84VaxhA3w6my+Wy9WW5XIxJ4nxsFMvpSM3dqNKKmSaRRASItNZPaF0udHDp+QCWCiK+mcHRQHfgiTwfquSifhsejnDwDhcgURlcgZSpWZ/PJsvgYZWHAJ0y8VsMmhV0kG3RQ0CO98Fkodqrb7H53pvPFsc92wAtgU56TcKcb9NLxPxuPQVToXDE8kv7IFUBRsR74rWANkM71YzQadBAZJIX+M0OHxEYXSHcvX+ZL78mwhCrebTQeM56jErxWe5oMnkiRZaI5g7+mrvA8aMxLFS3GdRnePi8BCF2RsrYTi5PE0EAYFNupWk//IMFxgnhckbK3cm8xND2gBGbNqrpoAL4f+xDtcr3RYuqAijJ1bunmnauPrV5I1FiRyvebAS8Xj7FY8vQOQG9yOI6dRhOmC1IPovCa9JLjxyL4MgBCJEskcqUxndkSIGYqI/fw4grm7l0X2BCn4bLjj7oGDBuzDsMNs8kUJ7fG72aFaLSacYtmslvw0Xly9WGa/dvhv/jrtQstTGSWYm4JqPW7l7q1L0ZrhAWSst3nAyk8vltxTKte6YsQnUBjmqpbyGtynkCFCjN15qYJ3ujt4AJxhmbw21JHrliEMj/jUsrlBpC5c6+JSY7SHhNE5/jgnUYtLO3VlAFdIWCIeLaFzJBpgU6OVuwymT3nusyOFr3K37pTI4PLHOk8amZ0w/pwBS2HkOXCoOwwIqvS/bIZjcQe+xmo9qCRDWwWitVbnu7LNV67DuLfKDImRLBcN6jTk1B1MhaypqOW1n/UbpvjBYU4Ei7JdDVweFwZ6KWozrCbd2n0EWVUsCy/kN+wyyp4IZLAUv5YIvUFEL/PXRrhJtB4tV1aSZAoO1XY3ZVIHByvoudhMGi6p/VrNe4c6EbuuCVRU5KAcvZdu6YFNFzYcv4f1NzKpqgdcer5VfoxrX4w7V16gmjYRTvb2xWFUt/5MqmEDHF6nGtZj9i8oCf43avqTYV/NhJWzd7WRYVYEFK2D5kolpNevmb/cbGRZVcM+U9uq/YhEBBdhIuDQIPVRsqkBVVCP7AmRVBVbGg6pgUQWHKgPW+y/YnFFw0+5Q73YxLKpA/ooPlwcPjqyp4NYs7T3IH3sqsIepRK73G05ale18ugo+eGf9JnRXfxuVN4t9/gMqOXiJOg6f5OATvtbz1IIHV4fQH2AMCKoFgpL9ckjCFamdsdfhbLFnCY/SP2SjVrN+JWJX/3pSxxUqrIF8c4CPJ3uIk09Rj7Oa440nn/HNyQ+HL9W7wtlKrbGj2cL643MOUt9CLaadwsOV6s3xI4crlBucd+FYYksy+ZQrt4Yzxi5qOeu/xFz6307pODyRTGu2OZxOF43b449k64xd1Ioc1p9u4DknrdgBWywypUq9RaPRmRyBTGPE7JgOmPBm9t76Nn1rOFy+QCjagSASme46kGsyOnykVvNx+zkIDzl/Cwqy7ozu4QulWnsw32LggiasGHHqjxzdHoPDFaB6Z/gZuM4cL5C9MVaKug2yYwfSxwBluXGNZstzpixqSeLtYvSnUf723PbPbFyhfGMIuzz0hf4G7PaMWoWo+xwTcPGAy/6QqfVgo4e+1vusWz31XMhlOMu0iUtnu0tVMPykWQp2y8bdajpgh82yc0xrl1Rz6Xt8bvQn5N9ksKE0HTSLcf+VFj2/BQjqUKw0uR6eKu3hFMr+ZIPdxjkxwqqZ0E+zWiJg0NjcNFCvfNFsFRuCyI72NdddTXI67LzmY/7rC6Yt1PWcpTLabx9z1VYfJ7bdWrh2br5serXjAfaaj987TbB/etKde4R1b0Zjdt5GM6U67EET5Hy9dkIWizk5m46HnUYlG7t3WbQyhEnydnB4AkSmMdl9wUSuXGt1+yN8MpkSBDGdTvDRoNuuV/KpsN9p0crFjHvdNLC9JZapDVa3PxRL50vVWqPVxjCs3WrUquXnNHxbwGbUANFHOvg0UIZIFVqj1eG5fYjEEql0JpNJPyVjkeCd13ll0ilR5KMRbYHvqgiBTa03Wmx2p9vj9Xo9P11226VJr1HANzs+SQSBvU6+UCSWyhQqtVan1+t1Wo1KKUc/930VGrio8cAiCt/EgSD0Szif7aGBnVwADwK/AT/Tf2GLdfeY/v6bb7753/Djx79XIeQcyFinoQAAAABJRU5ErkJggg=="
              />
              <image
                id="officePrefix__e"
                width={150}
                height={150}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
              <image
                id="officePrefix__g"
                width={98}
                height={96}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABgCAMAAADRs1c3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE1UExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALB7Sf8AAABndFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWaTGykTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAF10lEQVRoQ+2ae3fhWhiHB0kEcQ91q6K0qmhLXYqqGqNaxLVEEEHnfP+PcPZOaGfoIVKzzlrneP7oipT3sRPJu7J/+9v/GpnA4tXegDXlAooli9d70PG1FQiCoBimVOI4rhIAW7gSw1AUQaBNqgeWV4DauEpNaHV6g8lEkhargIUkzSajQacl1CocQ6FnZw2or0AwpYrQGUwWm8Pl9vhOA2fnwYsQ5CIYPAv4fR63y2Gzmg06Qo1jQLOLBXx/BMM1OpPVfuzxBy+jN/FE6i6by+cfCjwP+Vw2k07e3kTDwYDP7bCa9ISKtywqbAEMAMU1etLmPg1GYslM/rFUrrzU6lSz1W53IO12q9mgai+VcqmYz6Ri0Qv/icNiIHBUnEQmR3DCZHMHwrF0vlh+oZqd1z49YIaj8ZgFTOCf8Xg0ZBi63+u2qOrT9/xdPHLmsZu1QLLdIVNgGqPdG4plHsu1Zrc/GI5ZjpvOZrP5fP62BGyDPVOOY8cjpt9t1SvF7G341GkmlIh8UemfkCmUWqsnlMiX6+0eM5qA4rDwT4G/lixeQ9lsxk3GTL9DVQqpiM+mx7c4ZHJMZ/PH8pVmj2E5WB0UWpT9HF40n3HssN96KdwGnQZ887GSo8RRIPGd6o0moP6W6h8ADbCM6WY5feHQYZuGIVPgJk/se4uZzMTXF4AWbth5SgUs6k3DkCGao4t7iuHmu9UX+Pk2HbWLUacW3aRAta6rUpeVZIAOjn5OeAybjhQ42e54pc+9LT6zKz9nw/rdqVG5UaE/uX2mp9IGARTzUSPrN21WGDyJl8EXFONmLvAvK8CF9wcU7z2TR4Ebvcn9KmDjAT3zHZwg/ekqM9ufQgYbg06vNywxksehHDXcnwLcVQmzzXXiecfrDyVL7bHEK29dAU6u9sgXur5NLEkm07kSRUu+8tYViNoC7ts/Ki8f1KgOzUo+TmsKcCkfXz/Wu/TgA2Y45maSB7GuUJrAz6fPclPYNpeALrF4vwRWFDI5bgneN0ewM/zK4t2SWFUoVNZQoc1+5Vuv8qmiM5F+5Nf5TPHYPSjWOChEclCI5KAQyUEhkoNCJAeFSA4KkRwUIjkoRPKZotBh/7Di4qEtde7pU1YVcpw8yzWG04+pUciXnsRWFOBx0uhLVl5H7IT7hS89T64pUK0zfP/c6r4u6fV6NMNOpTtWFeBkmD2R9EOx9M6P8nOjB55hF5/YmVUFGIbGfBwIRaJXS65jqUK1N5E8jDWFTI6q9eSR3bHE6To5ixVbo31OFsGYQq0h3tEZHcFsfZ/zUVACk6J3MLX5NFUd7FUBJL8gVygN+564W+U/MYm6B8Wokd2m+PKENpXZMqGN6tyxJ+nT8m8zppb2GTfN/MsQwhEtdsYSf7U/55PeU/xEv1mhtp5nqn0Ywiw+Jh4Ywwyo/KWdQDZFJHKlwR19qPfH3A5JEgTmPFOWbhRjXtPmvAoMg/Re51/a9JjvHOI0QlrFMt1aIe63EuiG4wSHgWpITzhdrLb7Q1YI9TZ5wP9Ap+QzN7pTK2WiPqsW2xKCwruvyemPpgtPfHbITqYwlxRa7m/AXTA4nHLsCCaHz8XM9fkxSWBbI1AYsepIlz8czxTK1Ub7lWZGY9h7hdncOQ/YmE45bgLjT7rXadaeirlEJOC26lWoiCAX3Awxlc5sPwlc3qRyhVKlSjXb3dcePWCY4UhgOGQGMMNtt6ja84/H+3QscuZxkHo1hojLo6EEJ/Sk7dh3dnkVT2XuC0WYR1drdYpqAKh6rcon0YV8Nn17HT73ue2kASbeYgNvXsJn6kbS5nR7/eehMEzVk+m7TCYLyNylU4n4zVUkFAz4Tlw2i0m3U6IuwK8MQJW4Gi4NIK382gCv79QvcOrzetwup/3IYjbqtRqVctd1AQuE9Q0IigGRhl/hYDCaBIxGg16nJTRwcQPGr6KQvlgDtkK4/AOY+MxJKQA3+RUawhINyeU/4Lvub9EZhN+5eMcBqXz79jf0/hpU1lmOAwAAAABJRU5ErkJggg=="
              />
              <image
                id="officePrefix__i"
                width={150}
                height={147}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
              <image
                id="officePrefix__k"
                width={121}
                height={120}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB4CAMAAADheK3eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEvUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALvDKUAAABldFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWWFlaW1xdXl9gYWJjZGVmh8TzLgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAA4FJREFUaEPt2tlW2kAAgGGzkxAgEEREEQqyVAktoqIgWnFD2UQWMezQ93+Gjp6cGjU1yQCtbee79TC/CdmYzBKCIAiCIH8tDJ8NpoxjFoYTFM1YYDE0RcC1MYJmbYJLhOUSbCxNQKRBmHf7guFIFE4kHPSJPEwap3lPKJHOHGZzMLKHmXQi5OEpXBnPMIxk3aHU8VWpUoVTKV3mUyGRNb3ROGVbk47LrY4Mq9MqH0s+m+mNxmkhuHvV6g1HsIa91lU6KNCmy4xr86DcGU6msCbDTvlg08WYLlvEaK4qj6bfYU1HcjUbFS3my+5oriaPZyiP5Vou6kZlA1AZxscvY68Q7HLs6DeUwcMHQb5A8yuf87XugssYTtIWlrOq2Vx+6Vu9t9gyhlOsXfR4V1V8a4H43kWzP1loGaes4no4npCk5LMvqUyh+njDUMZ5ptwQdE3Adfv9MngGEAOJ/fxpoXCmcnFda2vtbGVcffplnLavJ3LF2l1TrdVqy/3RRMmpPA1qiG6ZsLjC+1fNh15/8MJwNJ5qfctPG2SAbhkjOA84f+ThWPlXf9LsAsrIevTLJOdNnN7Ncv5oA08G7x/bGGldlQrg/FE+MDfTcVe/nDxrDlB5DlBZAyrPESprQOU5QmUN/2TZwDMJKs8JKmtA5TlCZQ2oPEcfvAx+P/+ZslcqNBbxy123zK1snzzO9r2iDPCW8nc9BmZo2OVYrtIZjMYv/XKKRhlZj4H5MMb5KX1ebz/IXbVefzDSnHtUBtZloEzxq/FM4aZSU7utN9pdrcnHOZYxwiKsxb7uH+aOVPIn56VmV+t1lTKwLv3yEk6yjhV/KBKNxp7FEzv5Unsww0aD8vvHNoCTjNXuFN1qHt/mzlljwfPbYIfj5OvX+pzDt31yu+g5fZB+vZaBoDhP/GjhbxM0gMPOHUPvq8xCZeP+23J1xjK4bsOsMxAj2YqsfaM0Aly3HyrZCESZcYUzpfvBmzc6ho0H9zeZMMSqDloI7Fw05P4QVl9unKcCDtMrWTCSX93KFeut9j2cdqtezG55edLsuiFw4XYGpMPTy+I1nOLl6YG04bSYX6aFU5zojyVT6d09GLvpVDLmFznS7M5+vGdTnOBZ2wgE4QQ2fB6Bo2DW44HHBYbj7Q5Ydp5jSMiFgKBNUjQsigRdqPAj7M3DinHgs8ooCIIgCIJ8YEtLPwCNApWmhxcMaAAAAABJRU5ErkJggg=="
              />
              <image
                id="officePrefix__m"
                width={210}
                height={210}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
              <image
                id="officePrefix__o"
                width={128}
                height={128}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
            <g transform="translate(-91 -303)" clipPath="url(#officePrefix__a)">
              <g transform="translate(216 310)" clipPath="url(#officePrefix__b)">
                <use width="100%" height="100%" xlinkHref="#officePrefix__c" />
              </g>
              <g clipPath="url(#officePrefix__d)">
                <use
                  transform="translate(220 314) scale(.61333)"
                  width="100%"
                  height="100%"
                  xlinkHref="#officePrefix__e"
                />
              </g>
              <g transform="translate(461 315)" clipPath="url(#officePrefix__f)">
                <use width="100%" height="100%" xlinkHref="#officePrefix__g" />
              </g>
              <g transform="matrix(1.0039 0 0 1 465 319)" clipPath="url(#officePrefix__h)">
                <use
                  transform="scale(.55782)"
                  width="100%"
                  height="100%"
                  xlinkHref="#officePrefix__i"
                />
              </g>
              <g transform="translate(331 303)" clipPath="url(#officePrefix__j)">
                <use width="100%" height="100%" xlinkHref="#officePrefix__k" />
              </g>
              <g transform="matrix(1.0094 0 0 1 335 307)" clipPath="url(#officePrefix__l)">
                <use
                  transform="scale(.50476)"
                  width="100%"
                  height="100%"
                  xlinkHref="#officePrefix__m"
                />
              </g>
              <g clipPath="url(#officePrefix__n)">
                <use
                  transform="translate(91 307) scale(.82812)"
                  width="100%"
                  height="100%"
                  xlinkHref="#officePrefix__o"
                />
              </g>
            </g>
          </svg>
        </div>
      }
      secondarySlot={<Excel />}
      classMargin="ml-auto"
    />
    <SplitSection
      reverseOrder
      primarySlot={
        <div className="lg:pl-32 xl:pl-48 border-r-2 pr-8 border-primary text-right ">
          <h3 className="text-3xl font-light leading-tight mb-6 ">PLATAFORMA POWER</h3>
          <p className="text-gray-700 mb-4">
            Implemente as ferramentas mais novas <br /> e modernas da Microsoft. Faça a gestão da
            sua <br /> empresa utilizando o Power BI, aplicativos <br /> ou fluxos automatizados
            entre APIs.
          </p>
          <svg className="w-64 ml-auto" overflow="hidden" viewBox="0 0 315 95">
            <defs>
              <clipPath id="powerPrefix__a">
                <path d="M805 315h315v95H805z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__b">
                <path d="M0 0h97v96H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__d">
                <path d="M0 0h82v82H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__f">
                <path d="M0 0h97v96H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__h">
                <path d="M0 0h82v82H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__j">
                <path d="M0 0h96v96H0z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <clipPath id="powerPrefix__l">
                <path d="M919 319h82v82h-82z" clipRule="evenodd" fillRule="evenodd" />
              </clipPath>
              <image
                id="powerPrefix__c"
                width={97}
                height={96}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAABgCAMAAAA6hOw0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaqAR4AAABNdFJOUwABAgMEBQYHCAoLDA0ODxAREhMUFRYYGRocHh8gIiMkJSYnKCsuMDM1Nzg5Ojs8PT4/QkVGSEpLTE1OT1BSVFdYWVpbXF5fYGJjZGVmR+5NQQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAXRJREFUaEPt2klTwkAQhmFmSDJhicMiyhLCvgWUoLJKEARk8///HsGCGC7ahz5Z/VxTlbf6/E2AwDGOjrHzv08YD6qa0DEJTQn6ElzRIzKRxBSXYaF4CRbU5Z1ZLFfwlArZlCH4JcHVyH250ek6PSzOo123bsPeEVyTZuNpNHXxvA6cWsZQ+aUgEsXO6G21xrOc9Zum1LyCniw709V2t8ey2yxGdj7mL1Qcd707fGI5bJfjtnVd6Lnr/fkzgmNhQoW/UAGCChBUgKACBBUgqABBBQgqQFABggoQVICgAgQVIKgAQQUIKkBQAYIKEFSAoAIEFSCoAPFfC9+LH5r99n3cvt4US93pcrPF8zEftvwFES/Yg9liiWfuvjRyvuVVk9m60x+NJ1jGw+eHajrqrcdMiaSsWtNuo7FbjaqZDHkLOAsKI5Ux8xaefC6djGjein88QoQMGUMkb6Ihzf/YgXFF1XCpys8FJwz9SQi7ehFCfhUIfAFDGOZ0WYpm7AAAAABJRU5ErkJggg=="
              />
              <image
                id="powerPrefix__e"
                width={128}
                height={128}
                preserveAspectRatio="none"
                xlinkHref="data:image/jpeg;base64,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"
              />
              <image
                id="powerPrefix__g"
                width={97}
                height={96}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAABgCAMAAAA6hOw0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAERUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhfuUwAAABbdFJOUwABAgMEBQYHCAkKCwwNDg8QERITFBUWFxkaGxwdHiAhIiMkJicoKSosLi8xMzQ1Njc4Ojs8PT4/QEFDREZHSElKS0xNT1BRUlNUVldYWVpbXF1eX2BhYmNkZWadoOnxAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABlUlEQVRoQ+3aWU/CQBDA8e72RiyHFEGl4kE9EAsq4C2eFEWUylH8/h9ESVoEjXEe5snM73WT/Se7jzPCv8JQBZdOMMa5iIvz6QrjkqLpqDRVFnlw/Tgg60bSTGNKJaKaNEkwSU9k85v2Fh57w1o0VDF8KK4Y2cL+Uf0EzXHtoLiWjkhBgXE1mS+d3TbdFhb3vlHbWTbksCBqqY3D23bXe8PivbQuSlZMCT6CibpZqD28Dnw0w1772lmNTxXSdr3pDUfvWPxB56acny0cu54fHCMYfRYqVPgDFSCoAEEFCCpAUAGCChBUgKACBBUgqABBBQgqQFABggoQVICgAgQVIKgAQQUIKkBQAYIKEP+zYNr1Znfgj7D4/W8TP80sVO86vf4AS897unKsrwLXFtYrV267g+b58f60mDPCgsDVeG63et64RtO4PK3YmWg4PRa4HE3nt/ccp4zFKRXtXFKfzNiZqBrmUs5axWOtZJJzcvhI44QSmY/FEcWMqC5P71MwLskKKlkSZxY2xgsnHNfPtRPyK0H4AO+iUBNnbJJ2AAAAAElFTkSuQmCC"
              />
              <image
                id="powerPrefix__i"
                width={105}
                height={105}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABpCAMAAAAOXP0IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIlUExUReu9EOy9Eey8Ee28Eey8EQAAAAEAAAEBAAIBAAICAAMCAAMDAAQDAAQEAAUEAAYFAAcFAAcGAAgGAQkHAQoIAQwJAQwKAQ0KAQ0LAQ4LARANARMPARYRAhYSAhcSAhgTAhoVAhsWAhwWAh8ZAiAZAiAaAiIbAiMbAiMcAyQdAyUdAyggAywjAy0kAy8lAzAmAzEnBDIoBDMoBDMpBDQpBDQqBDUqBDYrBDcsBDkuBD0wBD0xBEAzBUQ2BUY4BUg5BUs8BUw9BU8/BlNCBlRDBlVEBlZFBldFBlhGBllHBlpIBltIB11KB19MB2FNB2dSB2hTCGtVCGxWCG9ZCHNbCHNcCHZeCHdfCXlhCXtiCX1jCX1kCX5lCX9lCYFnCYZrCohsCohtColtCopuCo1xCo9yCpByCpBzCpN2CpR2C5Z4C5h5C5l6C5p7C5t8C5x8C55+C59/C6CADKGAC6KBDKOCDKSDDKaEDKeFDKiGDKqIDKuIDKyJDK+LDbGNDbKODbeSDbiSDbiTDbmTDbqUDbuVDb2WDr2XDr6YDr+YDsCZDsGaDsKbDsSdDsWdDseeDsifDsigDsmgDsmhDsuiD8yiD86lD8+lD9CmD9KoD9OoD9SpD9WqD9aqD9arD9esD9isENitENuuENuvENyvEN+yEOGzEOG0EOK0EOK1EOO1EOS2EOW2EOW3EOe4Eee5Eei5Eem6Eeq7Eeu7Eeu8Eey8Ee29ES/XZwsAAAAFdFJOU5uzv8/v2a98gQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAvlJREFUaEPtmGdXE0EUQCP4jCAqQgBFBWyoRMQKogIWFBtiF2zYGxZix0JAsSsqiij2gi2WBJL9fc7svt0EmJxsdjJ8Ye6n+wj77klI9kywDVUGhnhZ4kCWeJAlHmSJB1niQZZ4kCUeZImHQVXye75Z4vufAG7oQ5jSp51OB1hj3LyDP3BLL5ilwLEMvMwaOTdwUSjM0o5hAPb06XlWmJpCUiPP4KYQWCWXHWBBow+naPG4pgGkPsIpCKP0MwugohsHK3QVART3e18wSqcBnH/RrfEmDRIeoxswSqsAjqBaZRPAblQDRmkWwHtUq1wGWI1qwChlA3hQrXITYAWqgSyZRVzJe/3A+V/oFGGlznxyB8q+gxNBVMlP7gk0FXxWokqt5D5JOYmzuFKDFoIanMWVLslSkMFV8teXFKx5iEOQ2JcCVeQkA6Ov4WgQ+9Jd7ROa48VZJ/alGtz4AGed2Jc248YmnHWElwL6AUpwqeeEMzP/rHqqE1zaRs1eTVVsqSNR1eQPxMWWjqPXExdb2o9eR1yWQuhX0r+gCC79q507c+0LVWNemhRa8pXRHWPvUTdfajJXWgjwFFVRzmlL5tBX0HzpFEAlqgGjVAWwHVVR1mtLxnwhbr60DOAwqgGj5AbI7ESn11CS3hE3XXInQspHdANGqWc+QF4HDlZKt8YDbEAPwigprQ6A9C2N7fSJRVnyvWprqBgBMKWL/Lw3rJLiTlOvnOCLuvRSs8nP6JreMEvK8yX0962WEso/0yV9YJcUpWVraWFpd9Slt4VFy3e10wX9CFfSsfKOYDMYS+u0Jcn0b1ytOdwnXofuIt6CXksvCEukUr22ZDa977VoZ9iJ9Az7Okl1x1fiv7NUT9Y/7WwilXwldEnGbeqBSuqjLqoP7KHZ4YdUv5pKPGGf6mGJVFK8ewtmrHyiuf/ootyyZs2VC4tzl15Bb9tYXO5GD0fEEiH0n4LhPDJmSrFBlniQJR5kiQdZ4kGWeJAlHmSJh3jbkLgBIc72HxtSRf/RR1mEAAAAAElFTkSuQmCC"
              />
              <image
                id="powerPrefix__k"
                width={96}
                height={96}
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADnUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaqAR4AAABNdFJOUwABAgMEBQYHCAkLDA0ODxAREhQVFhgZGx0eISIjJCUmKCkqLjEyMzU2Nzg6Ozw+P0BBREhKTE1OT1BRUlNUVlhaW1xdXl9gYWJjZGVmPAjlfAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAYNJREFUaEPt2slygkAQgGEYEMYFFfd9TzQRo0YN7lHUKJL3f55oFW5lKn1In6z+rlTNX8Mcu4UHIqJyDz0RRcYkVIxdN0QmK9yLiauKfEmIzOPV9GgMUUQPcJm55wui7NWTuVIFT7mYSYS4dLoCU7Rkud7qdLF02sZzMe6X3YDIuJ6rv5uT6QzJdDzo1tJBxf1HosSjpZb5uVpvkKytef81F1bPAW+s0pmsdnss9nZpNvP6bWC63jvfSBzbGhqF20B3ttm7n//PsVejFgX+QgEQBUAUAFEARAEQBUAUAFEARAEQBUAUAFEARAEQBUAUAFEARAEQBUAUAFEARAEQBUCPGehM17aDZb+7G9SV22Nra2PZfS0+rkeNjEeKxmC+tFZIrMWs18iGT9NYgal65qnbN4cjJEOz91ZNaZeAJ5Ao1l6aRguJ0WxUczHfaWB9eAQeiqez+QKafDYV09TzyF1gMvcHwzqisOa7Ov/wzJKsKCoi5Xrr4ei4uYHrbjmE/E4QfgBDO9KXKuwyugAAAABJRU5ErkJggg=="
              />
              <image
                id="powerPrefix__m"
                width={150}
                height={150}
                preserveAspectRatio="none"
                xlinkHref="data:image/jpeg;base64,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"
              />
            </defs>
            <g transform="translate(-805 -315)" clipPath="url(#powerPrefix__a)">
              <g transform="translate(804 315)" clipPath="url(#powerPrefix__b)">
                <use width="100%" height="100%" xlinkHref="#powerPrefix__c" />
              </g>
              <g transform="matrix(1.0122 0 0 1 808 319)" clipPath="url(#powerPrefix__d)">
                <use
                  transform="scale(.64062)"
                  width="100%"
                  height="100%"
                  xlinkHref="#powerPrefix__e"
                />
              </g>
              <g transform="translate(1025 315)" clipPath="url(#powerPrefix__f)">
                <use width="100%" height="100%" xlinkHref="#powerPrefix__g" />
              </g>
              <g transform="matrix(1.0122 0 0 1 1029 319)" clipPath="url(#powerPrefix__h)">
                <use
                  transform="scale(.78095)"
                  width="100%"
                  height="100%"
                  xlinkHref="#powerPrefix__i"
                />
              </g>
              <g transform="translate(915 315)" clipPath="url(#powerPrefix__j)">
                <use width="100%" height="100%" xlinkHref="#powerPrefix__k" />
              </g>
              <g clipPath="url(#powerPrefix__l)">
                <use
                  transform="translate(919 319) scale(.54667)"
                  width="100%"
                  height="100%"
                  xlinkHref="#powerPrefix__m"
                />
              </g>
            </g>
          </svg>
        </div>
      }
      secondarySlot={<PowerBI />}
      classMargin="mr-auto"
    />
    <LabelText className="mb-0 md:mb-8 mt-24 text-gray-600 text-center">Clientes</LabelText>
    <LogoSection />
    <section id="depoimentos" className="py-10 lg:py-40">
      <div className="container mx-auto">
        <LabelText className="mb-8 text-gray-600 text-center">
          O que dizem nossos clientes
        </LabelText>
        <div className="flex flex-col md:flex-row md:-mx-3">
          {customerData.map(customer => (
            <div key={customer.customerName} className="flex-1 px-3">
              <CustomerCard customer={customer} />
            </div>
          ))}
        </div>
        <a target="_blank" rel="noreferrer" href="https://bit.ly/2U2Kerl">
          <Button className="flex mx-auto mt-8">Veja mais</Button>
        </a>
      </div>
    </section>
    <section className="container mx-auto my-20 py-24 bg-gray-200 rounded-lg text-center">
      <h3 className="text-5xl font-semibold">Ficou com alguma dúvida?</h3>
      <p className="mx-4 md:mx-auto mt-8 mb-12 text-lg font-light">
        Estamos à sua disposição! Vamos encontrar a solução ideal para você ou sua empresa.
      </p>
      <p>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://api.whatsapp.com/send?phone=5551996936418&text=Ol%C3%A1!%20Voc%C3%AA%20pode%20me%20ajudar?"
        >
          <Button size="lg">Fale com a gente</Button>
        </a>
      </p>
    </section>
  </Layout>
);
