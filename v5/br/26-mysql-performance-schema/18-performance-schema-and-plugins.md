## 25.18 Schema de desempenho e plugins

A remoção de um plugin com `UNINSTALL PLUGIN` não afeta as informações já coletadas para o código desse plugin. O tempo gasto executando o código enquanto o plugin estava carregado ainda foi gasto, mesmo que o plugin seja descarregado posteriormente. As informações do evento associadas, incluindo informações agregadas, permanecem legíveis nas tabelas do banco de dados `performance_schema`. Para obter informações adicionais sobre o efeito da instalação e remoção de plugins, consulte Seção 25.7, “Monitoramento do Status do Schema de Desempenho”.

Um implementador de plugins que instrumenta o código do plugin deve documentar suas características de instrumentação para permitir que aqueles que carregam o plugin considerem suas necessidades. Por exemplo, um mecanismo de armazenamento de terceiros deve incluir em sua documentação quanto memória o motor precisa para mutex e outros instrumentos.
