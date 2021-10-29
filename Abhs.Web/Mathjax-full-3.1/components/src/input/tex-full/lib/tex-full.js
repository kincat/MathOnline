import {combineWithMathJax} from '../../../../../js/components/global.js';

import * as module1 from '../../../../../js/input/tex.js';
import * as module2 from '../../../../../js/input/tex/AllPackages.js';
import * as module3 from '../../../../../js/input/tex/Configuration.js';
import * as module4 from '../../../../../js/input/tex/FilterUtil.js';
import * as module5 from '../../../../../js/input/tex/FindTeX.js';
import * as module6 from '../../../../../js/input/tex/MapHandler.js';
import * as module7 from '../../../../../js/input/tex/NodeFactory.js';
import * as module8 from '../../../../../js/input/tex/NodeUtil.js';
import * as module9 from '../../../../../js/input/tex/ParseMethods.js';
import * as module10 from '../../../../../js/input/tex/ParseOptions.js';
import * as module11 from '../../../../../js/input/tex/ParseUtil.js';
import * as module12 from '../../../../../js/input/tex/Stack.js';
import * as module13 from '../../../../../js/input/tex/StackItem.js';
import * as module14 from '../../../../../js/input/tex/StackItemFactory.js';
import * as module15 from '../../../../../js/input/tex/Symbol.js';
import * as module16 from '../../../../../js/input/tex/SymbolMap.js';
import * as module17 from '../../../../../js/input/tex/Tags.js';
import * as module18 from '../../../../../js/input/tex/TexConstants.js';
import * as module19 from '../../../../../js/input/tex/TexError.js';
import * as module20 from '../../../../../js/input/tex/TexParser.js';
import * as module21 from '../../../../../js/input/tex/action/ActionConfiguration.js';
import * as module22 from '../../../../../js/input/tex/amscd/AmsCdConfiguration.js';
import * as module23 from '../../../../../js/input/tex/amscd/AmsCdMethods.js';
import * as module24 from '../../../../../js/input/tex/ams/AmsConfiguration.js';
import * as module25 from '../../../../../js/input/tex/ams/AmsItems.js';
import * as module26 from '../../../../../js/input/tex/ams/AmsMethods.js';
import * as module27 from '../../../../../js/input/tex/autoload/AutoloadConfiguration.js';
import * as module28 from '../../../../../js/input/tex/base/BaseConfiguration.js';
import * as module29 from '../../../../../js/input/tex/base/BaseItems.js';
import * as module30 from '../../../../../js/input/tex/base/BaseMethods.js';
import * as module31 from '../../../../../js/input/tex/bbox/BboxConfiguration.js';
import * as module32 from '../../../../../js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import * as module33 from '../../../../../js/input/tex/braket/BraketConfiguration.js';
import * as module34 from '../../../../../js/input/tex/braket/BraketItems.js';
import * as module35 from '../../../../../js/input/tex/braket/BraketMethods.js';
import * as module36 from '../../../../../js/input/tex/bussproofs/BussproofsConfiguration.js';
import * as module37 from '../../../../../js/input/tex/bussproofs/BussproofsItems.js';
import * as module38 from '../../../../../js/input/tex/bussproofs/BussproofsMethods.js';
import * as module39 from '../../../../../js/input/tex/bussproofs/BussproofsUtil.js';
import * as module40 from '../../../../../js/input/tex/cancel/CancelConfiguration.js';
import * as module41 from '../../../../../js/input/tex/colorv2/ColorV2Configuration.js';
import * as module42 from '../../../../../js/input/tex/color/ColorConfiguration.js';
import * as module43 from '../../../../../js/input/tex/color/ColorConstants.js';
import * as module44 from '../../../../../js/input/tex/color/ColorMethods.js';
import * as module45 from '../../../../../js/input/tex/color/ColorUtil.js';
import * as module46 from '../../../../../js/input/tex/configmacros/ConfigMacrosConfiguration.js';
import * as module47 from '../../../../../js/input/tex/enclose/EncloseConfiguration.js';
import * as module48 from '../../../../../js/input/tex/extpfeil/ExtpfeilConfiguration.js';
import * as module49 from '../../../../../js/input/tex/html/HtmlConfiguration.js';
import * as module50 from '../../../../../js/input/tex/html/HtmlMethods.js';
import * as module51 from '../../../../../js/input/tex/mhchem/MhchemConfiguration.js';
import * as module52 from '../../../../../js/input/tex/newcommand/NewcommandConfiguration.js';
import * as module53 from '../../../../../js/input/tex/newcommand/NewcommandItems.js';
import * as module54 from '../../../../../js/input/tex/newcommand/NewcommandMethods.js';
import * as module55 from '../../../../../js/input/tex/newcommand/NewcommandUtil.js';
import * as module56 from '../../../../../js/input/tex/noerrors/NoErrorsConfiguration.js';
import * as module57 from '../../../../../js/input/tex/noundefined/NoUndefinedConfiguration.js';
import * as module58 from '../../../../../js/input/tex/physics/PhysicsConfiguration.js';
import * as module59 from '../../../../../js/input/tex/physics/PhysicsItems.js';
import * as module60 from '../../../../../js/input/tex/physics/PhysicsMethods.js';
import * as module61 from '../../../../../js/input/tex/require/RequireConfiguration.js';
import * as module62 from '../../../../../js/input/tex/tagformat/TagFormatConfiguration.js';
import * as module63 from '../../../../../js/input/tex/textmacros/TextMacrosConfiguration.js';
import * as module64 from '../../../../../js/input/tex/textmacros/TextMacrosMethods.js';
import * as module65 from '../../../../../js/input/tex/textmacros/TextParser.js';
import * as module66 from '../../../../../js/input/tex/unicode/UnicodeConfiguration.js';
import * as module67 from '../../../../../js/input/tex/verb/VerbConfiguration.js';

combineWithMathJax({_: {
    input: {
        tex_ts: module1,
        tex: {
            AllPackages: module2,
            Configuration: module3,
            FilterUtil: module4,
            FindTeX: module5,
            MapHandler: module6,
            NodeFactory: module7,
            NodeUtil: module8,
            ParseMethods: module9,
            ParseOptions: module10,
            ParseUtil: module11,
            Stack: module12,
            StackItem: module13,
            StackItemFactory: module14,
            Symbol: module15,
            SymbolMap: module16,
            Tags: module17,
            TexConstants: module18,
            TexError: module19,
            TexParser: module20,
            action: {
                ActionConfiguration: module21
            },
            amscd: {
                AmsCdConfiguration: module22,
                AmsCdMethods: module23
            },
            ams: {
                AmsConfiguration: module24,
                AmsItems: module25,
                AmsMethods: module26
            },
            autoload: {
                AutoloadConfiguration: module27
            },
            base: {
                BaseConfiguration: module28,
                BaseItems: module29,
                BaseMethods: module30
            },
            bbox: {
                BboxConfiguration: module31
            },
            boldsymbol: {
                BoldsymbolConfiguration: module32
            },
            braket: {
                BraketConfiguration: module33,
                BraketItems: module34,
                BraketMethods: module35
            },
            bussproofs: {
                BussproofsConfiguration: module36,
                BussproofsItems: module37,
                BussproofsMethods: module38,
                BussproofsUtil: module39
            },
            cancel: {
                CancelConfiguration: module40
            },
            colorv2: {
                ColorV2Configuration: module41
            },
            color: {
                ColorConfiguration: module42,
                ColorConstants: module43,
                ColorMethods: module44,
                ColorUtil: module45
            },
            configmacros: {
                ConfigMacrosConfiguration: module46
            },
            enclose: {
                EncloseConfiguration: module47
            },
            extpfeil: {
                ExtpfeilConfiguration: module48
            },
            html: {
                HtmlConfiguration: module49,
                HtmlMethods: module50
            },
            mhchem: {
                MhchemConfiguration: module51
            },
            newcommand: {
                NewcommandConfiguration: module52,
                NewcommandItems: module53,
                NewcommandMethods: module54,
                NewcommandUtil: module55
            },
            noerrors: {
                NoErrorsConfiguration: module56
            },
            noundefined: {
                NoUndefinedConfiguration: module57
            },
            physics: {
                PhysicsConfiguration: module58,
                PhysicsItems: module59,
                PhysicsMethods: module60
            },
            require: {
                RequireConfiguration: module61
            },
            tagformat: {
                TagFormatConfiguration: module62
            },
            textmacros: {
                TextMacrosConfiguration: module63,
                TextMacrosMethods: module64,
                TextParser: module65
            },
            unicode: {
                UnicodeConfiguration: module66
            },
            verb: {
                VerbConfiguration: module67
            }
        }
    }
}});
