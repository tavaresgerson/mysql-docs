## 1.3 Lançamentos do MySQL: Inovação e LTS

O modelo de lançamento do MySQL é dividido em duas faixas principais: LTS (Suporte de Longo Prazo) e Inovação. Todos os lançamentos LTS e de Inovação incluem correções de bugs e de segurança e são considerados de qualidade para produção.

**Figura 1.1 Cronograma de Lançamentos do MySQL**

![Gráfico mostra o ciclo geral de lançamento, começando com a série de correções de bugs do MySQL 8.0.0, e mostra lançamentos de Inovação curtos entre cada versão longa LTS. Aproximadamente a cada dois anos, um novo ramo da série LTS é iniciado, incluindo 8.4.x e 9.7.x.](images/mysql-lts-innovation-versioning-graph.png)

### Lançamentos LTS do MySQL

* `Público`: Se o seu ambiente requer um conjunto estável de recursos e um período de suporte mais longo.
* `Comportamento`: Esses lançamentos contêm apenas as correções necessárias para reduzir os riscos associados às mudanças no comportamento do software de banco de dados. Não há remoções dentro de um lançamento LTS. Recursos podem ser removidos (e adicionados) apenas no primeiro lançamento LTS (como o MySQL 8.4.0 LTS), mas não mais tarde.
A Política de **Suporte Vitalício da Oracle** (Oracle Lifetime Support), que inclui 5 anos de suporte principal e 3 anos de suporte estendido.

### Lançamentos de Inovação do MySQL

* `Público`: Se você deseja ter acesso aos recursos mais recentes, melhorias e alterações. Esses lançamentos são ideais para desenvolvedores e DBA que trabalham em ambientes de desenvolvimento dinâmicos com altos níveis de testes automatizados e técnicas modernas de integração contínua para ciclos de atualização mais rápidos.
* `Comportamento`: Além dos novos recursos nos lançamentos de inovação, mudanças de comportamento também são esperadas à medida que o código é refatorado, funcionalidades obsoletas são removidas e quando o MySQL é modificado para se comportar mais de acordo com os Padrões SQL. Isso não acontecerá dentro de um lançamento LTS.

As mudanças de comportamento podem ter um grande impacto, especialmente quando se trata de qualquer coisa relacionada à aplicação, como sintaxe SQL, novas palavras reservadas, execução de consultas e desempenho das consultas. As mudanças de comportamento podem exigir alterações na aplicação, o que pode envolver um esforço considerável para a migração. Nosso objetivo é fornecer as ferramentas e configurações necessárias para facilitar essas transições.
* `Suporte`: As versões de inovação são suportadas até a próxima versão de inovação.

### Portfólio do MySQL

O MySQL Server, o MySQL Shell, o MySQL Router, o MySQL Operator para Kubernetes e o MySQL NDB Cluster têm versões de inovação e LTS.

Os Conectores do MySQL têm uma versão que usa o número da versão mais recente, mas permanecem compatíveis com todas as versões do MySQL Server suportadas. Por exemplo, o MySQL Connector/Python 9.0.0 é compatível com o MySQL Server 8.0, 8.4 e 9.0.

### Instalação, Atualização e Downgrade

Ter duas faixas afeta a forma como o MySQL é instalado, atualizado e desatualizado. Normalmente, você escolhe uma faixa específica e todas as atualizações progridem de acordo.

Ao usar o repositório oficial do MySQL, a faixa desejada é definida na configuração do repositório. Por exemplo, com o Yum, escolha `mysql-innovation-community` para instalar e atualizar as versões de inovação ou `mysql-8.4-lts-community` para instalar e atualizar as versões do MySQL 8.4.x.

**Notas sobre LTS**

A funcionalidade permanece a mesma e o formato de dados não muda em uma série LTS, portanto, atualizações e desatualizações in-place são possíveis dentro da série LTS. Por exemplo, o MySQL 8.4.0 pode ser atualizado para uma versão posterior do MySQL 8.4.x. Métodos adicionais de atualização e downgrade estão disponíveis, como o plugin clone.

A atualização para a próxima série LTS é suportada, como 8.4.x LTS para 9.7.x LTS, enquanto pular uma série LTS não é suportado. Por exemplo, 8.4.x LTS não pode pular 9.7.x LTS para atualizar diretamente para 10.7.x LTS.

**Notas sobre inovação**

Uma instalação de Innovation segue um comportamento semelhante, pois uma versão de Innovation é atualizada para uma versão mais recente da série Innovation. Por exemplo, o MySQL 9.0.0 Innovation é atualizado para o MySQL 9.3.0.

A principal diferença é que você não pode fazer uma atualização direta entre uma série Innovation de diferentes versões principais, como 8.3.0 para 9.0.0. Em vez disso, primeiro atualize para a série LTS mais próxima e, em seguida, atualize para a série Innovation seguinte. Por exemplo, atualizar 8.3.0 para 8.4.0 e, em seguida, 8.4.0 para 9.0.0, é um caminho de atualização válido.

Para facilitar a transição, o repositório oficial do MySQL trata o primeiro lançamento LTS como tanto LTS quanto Innovation, portanto, por exemplo, com a trilha Innovation habilitada na configuração do repositório local, o MySQL 8.3.0 é atualizado para 8.4.0 e, posteriormente, para 9.0.0.

As atualizações de lançamento de Innovation requerem uma dump lógica e carregamento.

**Informações Adicionais e Exemplos**

Para informações adicionais e cenários de exemplo específicos suportados, consulte a Seção 3.2, “Caminhos de Atualização” ou o Capítulo 4, *Downgrading MySQL*. Eles descrevem as opções disponíveis para realizar atualizações in-place (que substituem os binários pelos pacotes mais recentes), uma dump lógica e carregamento (como usar `mysqldump` ou os utilitários de dump do MySQL Shell), clonagem de dados com o plugin de clonagem e replicação assíncrona para servidores em uma topologia de replicação.