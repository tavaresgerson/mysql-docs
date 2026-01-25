## 2.8 Instalando MySQL a Partir do Código-Fonte

2.8.1 Métodos de Instalação a Partir do Código-Fonte
2.8.2 Pré-requisitos para Instalação a Partir do Código-Fonte
2.8.3 Layout do MySQL para Instalação a Partir do Código-Fonte
2.8.4 Instalando MySQL Usando uma Distribuição Source Padrão
2.8.5 Instalando MySQL Usando uma Árvore Source de Desenvolvimento
2.8.6 Configurando o Suporte à Biblioteca SSL
2.8.7 Opções de Configuração do Source do MySQL
2.8.8 Lidando com Problemas na Compilação do MySQL
2.8.9 Configuração do MySQL e Ferramentas de Terceiros

A construção (Building) do MySQL a partir do código-fonte permite que você personalize parâmetros de compilação, otimizações do compilador e o local de instalação. Para obter uma lista de sistemas nos quais se sabe que o MySQL funciona, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Antes de prosseguir com uma instalação a partir do código-fonte (*source*), verifique se a Oracle oferece uma distribuição binária pré-compilada para sua plataforma e se ela atende às suas necessidades. Dedicamos um grande esforço para garantir que nossos binários sejam construídos com as melhores opções possíveis para um desempenho ideal. As instruções para a instalação de distribuições binárias estão disponíveis na Seção 2.2, “Instalando MySQL no Unix/Linux Usando Binários Genéricos”.

Se você estiver interessado em construir o MySQL a partir de uma distribuição Source usando opções de *build* iguais ou similares às usadas pela Oracle para produzir distribuições binárias em sua plataforma, obtenha uma distribuição binária, descompacte-a (*unpack*) e procure no arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição MySQL foi configurada e compilada.

Aviso

Construir o MySQL com opções não padronizadas pode levar à redução da funcionalidade, desempenho ou segurança.