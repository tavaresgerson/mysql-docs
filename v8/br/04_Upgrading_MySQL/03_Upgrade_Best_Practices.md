## 3.3 Práticas de Melhoria 3.3 Práticas de Melhoria

O MySQL suporta a atualização entre versões menores (dentro de uma série LTS) e para a próxima versão principal (entre uma série LTS). A atualização oferece as últimas funcionalidades, desempenho e correções de segurança.

Para preparar e ajudar a garantir o sucesso da sua atualização para a versão mais recente do MySQL, recomendamos as seguintes melhores práticas:

- Decida sobre a versão principal ou secundária para a atualização
- Decida sobre o tipo de atualização
- Revisar Plataformas Suportadas
- Entenda as mudanças no MySQL Server
- Execute o Verificador de Atualização e corrija incompatibilidades
- Execute aplicativos em um ambiente de teste
- Aplicações de referência e desempenho de carga de trabalho
- Execute ambas as versões do MySQL em paralelo
- Execute a Atualização de Teste Final
- Verifique o backup do MySQL
- Atualize o servidor de produção
- Suporte para empresas

### Decida sobre a versão principal ou secundária para a atualização

O Modelo de Lançamento do MySQL faz uma distinção entre as versões LTS (Suporte de Longo Prazo) e as versões de Inovação. As versões LTS têm suporte por mais de 8 anos e são destinadas ao uso em produção. As versões de Inovação fornecem aos usuários as últimas funcionalidades e capacidades. Saiba mais sobre o Modelo de Lançamento do MySQL.

Realizar uma atualização de versão menor é simples, enquanto as atualizações de versão maior exigem planejamento estratégico e testes adicionais antes da atualização. Este guia é especialmente útil para atualizações de versão maior.

### Decida sobre o tipo de atualização

Existem três maneiras principais de atualizar o MySQL. Leia a documentação associada para determinar qual tipo de atualização é mais adequado para sua situação.

- Uma atualização in-place: substituindo os pacotes do MySQL Server.

- Uma atualização lógica: exportar o SQL da antiga instância do MySQL para a nova.

- Uma atualização da topologia de replicação: considere o papel da topologia de cada servidor.

### Revisar Plataformas Suportadas

Se o seu sistema operacional atual não for suportado pela nova versão do MySQL, planeje fazer a atualização do sistema operacional, pois, caso contrário, a atualização local não será suportada.

Para uma lista atualizada das plataformas suportadas, consulte: <https://www.mysql.com/support/supportedplatforms/database.html>

### Entenda as mudanças no MySQL Server

Cada versão principal vem com novos recursos, mudanças no comportamento, deprecações e remoções. É importante entender o impacto de cada um desses itens em aplicativos existentes.

Veja: Seção 3.5, “Alterações no MySQL 8.0”.

### Execute o Verificador de Atualização e corrija incompatibilidades

A Ferramenta de Verificação de Atualização do MySQL Shell detecta incompatibilidades entre as versões do banco de dados que devem ser resolvidas antes de realizar a atualização. A função **util.checkForServerUpgrade()** verifica se as instâncias do servidor MySQL estão prontas para a atualização. Conecte-se ao servidor MySQL existente e selecione a versão do MySQL Server para a qual você planeja fazer a atualização, para que a ferramenta informe os problemas a serem resolvidos antes da atualização. Esses problemas incluem incompatibilidades em tipos de dados, motores de armazenamento, etc.

Você está pronto para fazer a atualização quando a ferramenta de verificação de atualização não mais relatar quaisquer problemas.

### Execute aplicativos em um ambiente de teste

Depois de concluir os requisitos do verificador de atualização, teste suas aplicações no novo servidor MySQL de destino. Verifique por erros e avisos no log de erro do MySQL e nos logs das aplicações.

### Aplicações de referência e desempenho de carga de trabalho

Recomendamos que você faça uma comparação entre suas próprias aplicações e cargas de trabalho, comparando como elas funcionam com as versões anteriores e novas do MySQL. Geralmente, as versões mais recentes do MySQL adicionam recursos e melhoram o desempenho, mas há casos em que uma atualização pode ser mais lenta para consultas específicas. Possíveis problemas que resultam em regressão de desempenho:

- A configuração do servidor anterior não é ideal para a versão mais recente

- Alterações nos tipos de dados

- Armazenamento adicional necessário para suporte a conjuntos de caracteres multi-bytes

- Alterações nos motores de armazenamento

- Índices descartados ou alterados

- Criptografia mais forte

- Autenticação mais forte

- Alterações no otimizador de SQL

- Novas versões do MySQL exigem memória adicional

- O hardware físico ou virtual é mais lento - computação ou armazenamento

Para informações relacionadas e técnicas de mitigação potenciais, consulte Regressões de Desempenho Válidas.

### Execute ambas as versões do MySQL em paralelo

Para minimizar o risco, é melhor manter o sistema atual funcionando enquanto o sistema atualizado estiver em funcionamento em paralelo.

### Execute a Atualização de Teste Final

Pratique e faça um teste antes de atualizar seu servidor de produção. Teste minuciosamente os procedimentos de atualização antes de atualizar um sistema de produção.

### Verifique o backup do MySQL

Verifique se o backup completo existe e é viável antes de realizar a atualização.

### Atualize o servidor de produção

Você está pronto para concluir a atualização.

### Suporte para empresas

Se você é cliente da Edição Empresarial do MySQL, também pode entrar em contato com os especialistas da equipe de suporte do MySQL para tirar qualquer dúvida que possa ter.
