### 25.4.3 Pré-filtragem de eventos

O pré-filtro é realizado pelo Schema de Desempenho e tem um efeito global que se aplica a todos os usuários. O pré-filtro pode ser aplicado na fase de produção ou consumo do processamento de eventos:

- Para configurar o pré-filtro na fase de produção, várias tabelas podem ser usadas:

  - `setup_instruments` indica quais instrumentos estão disponíveis. Um instrumento desabilitado nesta tabela não produz eventos, independentemente do conteúdo das outras tabelas de configuração relacionadas à produção. Um instrumento habilitado nesta tabela é permitido produzir eventos, sujeito ao conteúdo das outras tabelas.

  - `setup_objects` controla se o Schema de Desempenho monitora tabelas e objetos de programas armazenados específicos.

  - `threads` indica se o monitoramento está habilitado para cada thread do servidor.

  - `setup_actors` determina o estado de monitoramento inicial para novos threads de primeiro plano.

- Para configurar o pré-filtro na etapa do consumidor, modifique a tabela `setup_consumers`. Isso determina os destinos para os quais os eventos são enviados. A tabela `setup_consumers` também afeta implicitamente a produção de eventos. Se um evento específico não for enviado para nenhum destino (não for consumido), o Schema de Desempenho não o produz.

As modificações em qualquer uma dessas tabelas afetam o monitoramento imediatamente, com algumas exceções:

- As modificações em alguns instrumentos na tabela `setup_instruments` só são eficazes na inicialização do servidor; alterá-las em tempo de execução não tem efeito. Isso afeta principalmente mútuos, condições e rwlocks no servidor, embora possa haver outros instrumentos para os quais isso seja verdade. Essa restrição é levantada a partir do MySQL 5.7.12.

- As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes.

Quando você altera a configuração de monitoramento, o Schema de Desempenho não esvazia as tabelas de histórico. Os eventos já coletados permanecem nas tabelas de eventos atuais e de histórico até serem substituídos por eventos mais recentes. Se você desabilitar os instrumentos, pode ser necessário esperar um pouco antes que os eventos deles sejam substituídos por eventos mais recentes de interesse. Como alternativa, use `TRUNCATE TABLE` para esvaziar as tabelas de histórico.

Após fazer alterações na instrumentação, você pode querer truncar as tabelas de resumo. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, depois de fazer uma alteração na configuração de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

As seções a seguir descrevem como usar tabelas específicas para controlar o pré-filtro do Schema de Desempenho.
