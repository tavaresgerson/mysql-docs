## 28.4 Visão Geral do MySQL Enterprise Audit

A MySQL Enterprise Edition inclui o MySQL Enterprise Audit, implementado usando um *plugin* de servidor. O MySQL Enterprise Audit usa a API de Auditoria MySQL aberta para permitir o monitoramento e o *logging* padrão, baseado em políticas, da atividade de conexão e de *Query* executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit fornece uma solução de auditoria e conformidade pronta para uso (*out of box*) e fácil de usar para aplicações regidas por diretrizes regulatórias internas e externas.

Quando instalado, o *plugin* de auditoria permite que o MySQL Server produza um arquivo de *log* contendo um registro de auditoria da atividade do servidor. O conteúdo do *log* inclui quando os clientes se conectam e desconectam, e quais ações eles realizam enquanto conectados, como quais *Databases* e tabelas eles acessam.

Para mais informações, consulte a Seção 6.4.5, “MySQL Enterprise Audit”.