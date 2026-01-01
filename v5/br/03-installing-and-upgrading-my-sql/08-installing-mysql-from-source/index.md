## 2.8 Instalando o MySQL a partir da fonte

2.8.1 Métodos de instalação da fonte

2.8.2 Pré-requisitos para instalação da fonte

2.8.3 Layout do MySQL para Instalação de Fonte

2.8.4 Instalação do MySQL usando uma distribuição de fonte padrão

2.8.5 Instalação do MySQL usando uma árvore de fonte de desenvolvimento

2.8.6 Configurando Suporte à Biblioteca SSL

2.8.7 Opções de configuração de fonte do MySQL

2.8.8 Lidando com problemas de compilação do MySQL

2.8.9 Configuração do MySQL e Ferramentas de Terceiros

Construir o MySQL a partir do código-fonte permite que você personalize os parâmetros de compilação, otimizações do compilador e localização de instalação. Para uma lista dos sistemas nos quais o MySQL é conhecido por funcionar, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Antes de prosseguir com uma instalação a partir da fonte, verifique se a Oracle produz uma distribuição binária pré-compilada para sua plataforma e se ela funciona para você. Colocamos muito esforço em garantir que nossos binários sejam construídos com as melhores opções possíveis para um desempenho ótimo. As instruções para instalar distribuições binárias estão disponíveis na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”.

Se você estiver interessado em construir o MySQL a partir de uma distribuição de código-fonte usando opções de compilação semelhantes às usadas pela Oracle para produzir distribuições binárias na sua plataforma, obtenha uma distribuição binária, descompacte-a e verifique o arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição do MySQL foi configurada e compilada.

Aviso

Construir o MySQL com opções não padrão pode levar a uma funcionalidade, desempenho ou segurança reduzidos.
