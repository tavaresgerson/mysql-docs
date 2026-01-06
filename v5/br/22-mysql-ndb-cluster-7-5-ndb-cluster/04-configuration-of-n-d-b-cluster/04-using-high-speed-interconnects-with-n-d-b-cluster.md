### 21.4.4 Uso de interconexões de alta velocidade com o NDB Cluster

Mesmo antes do início do projeto do `NDBCLUSTER` em 1996, já era evidente que um dos principais problemas a serem enfrentados na construção de bancos de dados paralelos seria a comunicação entre os nós da rede. Por essa razão, o `NDBCLUSTER` foi projetado desde o início para permitir o uso de vários mecanismos de transporte de dados diferentes, ou transportadores.

O NDB Cluster 7.5 e 7.6 suportam três desses (veja Seção 21.2.1, “Conceitos Básicos do NDB Cluster”). Um quarto transportador, a Scalable Coherent Interface (SCI), também era suportado em versões muito antigas do `NDB`. Isso exigia hardware, software e binários do MySQL especializados que já não estão mais disponíveis.
