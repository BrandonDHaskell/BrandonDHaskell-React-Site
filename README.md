# BrandonDHaskell Personal Site
This is my personal site I built from scratch and my first endeavour into public web deployment. I did not use ```create-react-app```. This was quite the learning experience and it really stretched my brain to wrap my head around the components needed to fully deploy a website.

Feel free to explore my site [https://BrandonDHaskell.com](https://BrandonDHaskell.com), and learn a little bit more about me. You can also go through this README to see how I did it.


## Table of Contents

1. [Technology Used](#technology-used)
1. [Overview and Strategies](#overview-and-strategies)
1. [Back-End Details](#back-end-details)
1. [Front-End Details](#front-end-details)

## Technology Used

| Technology | URL |
|------------|-----|
| AWS EC2 | [https://aws.amazon.com/ec2/](https://aws.amazon.com/ec2/) |
| AWS Elastic IP | [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html) |
| Nginx | [https://www.nginx.com/](https://www.nginx.com/) |
| Express | [https://expressjs.com/](https://expressjs.com/) |
| React | [https://react.dev/](https://react.dev/) |
| Node JS | [https://nodejs.org/](https://nodejs.org/) |
| WebPack | [https://webpack.js.org/](https://webpack.js.org/) |
| Tailwindcss | [https://tailwindcss.com/](https://tailwindcss.com/) |
| TypeScript | [https://www.typescriptlang.org/](https://www.typescriptlang.org/) |
| CertBot | [https://certbot.eff.org/](https://certbot.eff.org/) |

## Overview and Strategies

The back-end is currently hosted on an AWS EC2. The EC2 instance is running an Nginx server as a reverse proxy for an Express server that returns a static React web page. Both the Nginx server and Express server are on the same EC2 instance. The Nginx server handles all the web requests and throttling for the Express server. 

![Back-End Setup](https://github.com/BrandonDHaskell/BrandonDHaskell-React-Site/assets/132218343/a7f91e89-d96e-43d7-a3a8-b6ee6d64f0ab)

The front-end is a static React app with Tailwindcss integrated for page styling and themes.

[Front-end Image here]

I chose the back-end configuration because React integrates well with Express and both are TypeScript capable. Nginx is highly optimized for handling web requests and is well suited as a proxy.

The front-end was chosen becuase React is a solid library for fast responsive web design and I also wanted to explore the capabilities of Tailwindcss for future projects.

This was also a learning experience for me as I wanted to explore implementations that can scale well for other projects and I also wanted to explore the details of React and webpack.


## Back-End Details

--TODO--


## Front-End Details

--TODO--

