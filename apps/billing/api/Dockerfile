# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build billing-api`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3000:3000 -t billing-api`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system billing-api && \
          adduser --system -G billing-api billing-api

COPY dist/apps/billing/api billing-api
RUN chown -R billing-api:billing-api .

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix billing-api --omit=dev -f install

CMD [ "node", "billing-api" ]
