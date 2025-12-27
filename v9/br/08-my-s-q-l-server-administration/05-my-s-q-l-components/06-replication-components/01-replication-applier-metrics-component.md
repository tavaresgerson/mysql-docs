#### 7.5.6.1 Componente de Aplicativo de Replicação

O componente de Aplicativo de Replicação implementa duas tabelas do Schema de Desempenho, listadas aqui:

* `replication_applier_metrics`: Exibe estatísticas para o aplicativo de replicação, para um canal de replicação específico.

* `replication_applier_progress_by_worker`: Exibe estatísticas para o aplicativo de replicação, para o trabalhador com o ID e o nome do canal especificados.

* Propósito: Fornecer tabelas de estatísticas do aplicativo de replicação no Schema de Desempenho do MySQL.

* URN: `file://component_replication_applier_metrics`

Para instruções de instalação, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

Este componente está disponível apenas como parte da Edição Empresarial do MySQL.

Importante

O componente `replication_applier_metrics` não funciona quando `replica_parallel_workers=0`.