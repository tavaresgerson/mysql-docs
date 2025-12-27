### 29.4.3 Pré-filtragem de Eventos

A pré-filtragem é realizada pelo Schema de Desempenho e tem um efeito global que se aplica a todos os usuários. A pré-filtragem pode ser aplicada na fase de produtor ou consumidor do processamento de eventos:

* Para configurar a pré-filtragem na fase de produtor, várias tabelas podem ser usadas:

  + `setup_instruments` indica quais instrumentos estão disponíveis. Um instrumento desabilitado nesta tabela não produz eventos, independentemente do conteúdo das outras tabelas de configuração relacionadas à produção. Um instrumento habilitado nesta tabela é permitido produzir eventos, sujeito ao conteúdo das outras tabelas.

  + `setup_objects` controla se o Schema de Desempenho monitora tabelas e objetos de programas armazenados específicos.

  + `threads` indica se o monitoramento está habilitado para cada fio do servidor.

  + `setup_actors` determina o estado de monitoramento inicial para novos threads de primeiro plano.

* Para configurar a pré-filtragem na fase de consumidor, modifique a tabela `setup_consumers`. Isso determina os destinos para os quais os eventos são enviados. A `setup_consumers` também afeta implicitamente a produção de eventos. Se um determinado evento não for enviado para nenhum destino (ou seja, nunca for consumido), o Schema de Desempenho não o produz.

As modificações em qualquer uma dessas tabelas afetam o monitoramento imediatamente, com a exceção de que as modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes.

Quando você altera a configuração de monitoramento, o Schema de Desempenho não esvazia as tabelas de histórico. Os eventos já coletados permanecem nas tabelas de eventos atuais e de histórico até serem substituídos por eventos mais recentes. Se você desabilitar os instrumentos, pode ser necessário esperar um pouco antes que os eventos deles sejam substituídos por eventos mais recentes de interesse. Alternativamente, use `TRUNCATE TABLE` para esvaziar as tabelas de histórico.

Após fazer alterações na instrumentação, você pode querer truncar as tabelas de resumo. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite limpar os valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, depois de fazer uma alteração na configuração de tempo de execução. Exceções a esse comportamento de truncação são mencionadas nas seções individuais das tabelas de resumo.

As seções a seguir descrevem como usar tabelas específicas para controlar o pré-filtro do Schema de Desempenho.