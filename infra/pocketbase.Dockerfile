FROM alpine:3.19 AS downloader

ARG PB_VERSION=0.23.4

RUN apk add --no-cache wget unzip ca-certificates && \
    wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
         -O /tmp/pb.zip && \
    unzip /tmp/pb.zip -d /pb && \
    chmod +x /pb/pocketbase && \
    rm /tmp/pb.zip

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates

COPY --from=downloader /pb/pocketbase /pb/pocketbase

VOLUME /pb/pb_data

EXPOSE 8090

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:8090/api/health || exit 1

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
