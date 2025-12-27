## 2.8 Instalando o MySQL a partir do código-fonte

2.8.1 Métodos de instalação a partir do código-fonte

2.8.2 Pré-requisitos para a instalação a partir do código-fonte

2.8.3 Estrutura do MySQL para a instalação a partir do código-fonte

2.8.4 Instalando o MySQL usando uma distribuição padrão de código-fonte

2.8.5 Instalando o MySQL usando uma árvore de código-fonte de desenvolvimento

2.8.6 Configurando o suporte à biblioteca SSL

2.8.7 Opções de configuração do código-fonte do MySQL

2.8.8 Lidando com problemas de compilação do MySQL

2.8.9 Configuração do MySQL e ferramentas de terceiros

2.8.10 Gerando conteúdo de documentação do Doxygen do MySQL

Construir o MySQL a partir do código-fonte permite que você personalize os parâmetros de compilação, otimizações do compilador e localização de instalação. Para uma lista dos sistemas nos quais o MySQL é conhecido por funcionar, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Antes de prosseguir com uma instalação a partir do código-fonte, verifique se a Oracle produz uma distribuição binária pré-compilada para sua plataforma e se ela funciona para você. Colocamos muito esforço em garantir que nossos binários sejam construídos com as melhores opções possíveis para um desempenho ótimo. As instruções para instalar distribuições binárias estão disponíveis na Seção 2.2, “Instalando o MySQL no Unix/Linux usando binários genéricos”.

Se você estiver interessado em construir o MySQL a partir de uma distribuição de código-fonte usando opções de compilação iguais ou semelhantes às usadas pela Oracle para produzir distribuições binárias em sua plataforma, obtenha uma distribuição binária, descompacte-a e procure no arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição do MySQL foi configurada e compilada.

Aviso

Construir o MySQL com opções não padrão pode levar a uma funcionalidade, desempenho ou segurança reduzidos.

O código-fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo gerado pelo Doxygen está disponível em https://dev.mysql.com/doc/index-other.html. Também é possível gerar esse conteúdo localmente a partir de uma distribuição de código-fonte do MySQL usando as instruções na Seção 2.8.10, “Gerando conteúdo de documentação do Doxygen do MySQL”.